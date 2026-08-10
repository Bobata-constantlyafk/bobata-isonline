import { verifyAccessJwt, type AccessEnv } from "./access";

export interface MessagesEnv extends AccessEnv {
  DB: D1Database;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Every handler in this file re-verifies the Access JWT itself — see
 *  worker/access.ts for why that matters beyond the edge-level gate. */
async function requireAdmin(request: Request, env: MessagesEnv) {
  const identity = await verifyAccessJwt(request, env);
  if (!identity) return null;
  return identity;
}

interface MessageRow {
  id: number;
  handle: string;
  message: string;
  created_at: string;
  read: number;
  archived: number;
}

/** GET /api/admin/messages — newest first. */
export async function handleListMessages(
  request: Request,
  env: MessagesEnv,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  const { results } = await env.DB.prepare(
    "SELECT id, handle, message, created_at, read, archived FROM messages ORDER BY created_at DESC",
  ).all<MessageRow>();

  return json({
    ok: true,
    messages: results.map((row) => ({
      id: row.id,
      handle: row.handle,
      message: row.message,
      createdAt: row.created_at,
      read: row.read === 1,
      archived: row.archived === 1,
    })),
  });
}

/** PATCH /api/admin/messages/:id — body: { read?: boolean, archived?: boolean } */
export async function handleUpdateMessage(
  request: Request,
  env: MessagesEnv,
  id: string,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  const messageId = Number(id);
  if (!Number.isInteger(messageId)) {
    return json({ ok: false, error: "INVALID ID" }, 400);
  }

  let body: { read?: unknown; archived?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "MALFORMED PAYLOAD" }, 400);
  }

  const sets: string[] = [];
  const values: number[] = [];
  if (typeof body.read === "boolean") {
    sets.push("read = ?");
    values.push(body.read ? 1 : 0);
  }
  if (typeof body.archived === "boolean") {
    sets.push("archived = ?");
    values.push(body.archived ? 1 : 0);
  }
  if (sets.length === 0) {
    return json({ ok: false, error: "NOTHING TO UPDATE" }, 400);
  }

  const result = await env.DB.prepare(
    `UPDATE messages SET ${sets.join(", ")} WHERE id = ?`,
  )
    .bind(...values, messageId)
    .run();

  if (result.meta.changes === 0) {
    return json({ ok: false, error: "NOT FOUND" }, 404);
  }
  return json({ ok: true });
}

/** DELETE /api/admin/messages/:id */
export async function handleDeleteMessage(
  request: Request,
  env: MessagesEnv,
  id: string,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  const messageId = Number(id);
  if (!Number.isInteger(messageId)) {
    return json({ ok: false, error: "INVALID ID" }, 400);
  }

  const result = await env.DB.prepare("DELETE FROM messages WHERE id = ?")
    .bind(messageId)
    .run();

  if (result.meta.changes === 0) {
    return json({ ok: false, error: "NOT FOUND" }, 404);
  }
  return json({ ok: true });
}
