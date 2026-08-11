import { verifyAccessJwt, type AccessEnv } from "./access";

export interface UploadEnv extends AccessEnv {
  MEDIA: R2Bucket;
  R2_PUBLIC_URL?: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — plenty for a poster/cover image
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * POST /api/admin/upload — body is the raw image bytes, content-type header
 * says what kind. Not multipart/form-data: the admin UI sends the file
 * directly (fetch with a File as the body), which is simpler on both ends
 * for a single-file upload with no other form fields.
 *
 * Writes to R2 under a random key (not the original filename — avoids
 * collisions and leaking anything about the admin's local files) and
 * returns the public r2.dev URL. Bucket is public for reads; this route is
 * the only write path, gated the same as every other admin endpoint.
 */
export async function handleUpload(
  request: Request,
  env: UploadEnv,
): Promise<Response> {
  const identity = await verifyAccessJwt(request, env);
  if (!identity) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  if (!env.R2_PUBLIC_URL) {
    console.error("upload: R2_PUBLIC_URL not configured");
    return json({ ok: false, error: "UPLOAD CHANNEL OFFLINE" }, 500);
  }

  const contentType = request.headers.get("content-type") ?? "";
  const ext = ALLOWED_TYPES[contentType];
  if (!ext) {
    return json(
      { ok: false, error: "UNSUPPORTED TYPE — jpg, png, webp, or gif only" },
      400,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BYTES) {
    return json({ ok: false, error: "TOO LARGE — 8MB max" }, 413);
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength === 0) {
    return json({ ok: false, error: "EMPTY UPLOAD" }, 400);
  }
  if (bytes.byteLength > MAX_BYTES) {
    return json({ ok: false, error: "TOO LARGE — 8MB max" }, 413);
  }

  const key = `${crypto.randomUUID()}.${ext}`;
  await env.MEDIA.put(key, bytes, {
    httpMetadata: { contentType },
  });

  return json({ ok: true, url: `${env.R2_PUBLIC_URL}/${key}` });
}
