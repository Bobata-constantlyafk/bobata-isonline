/**
 * One-way SHA-256 of a client IP. Stored alongside a message so an admin
 * can spot a spam burst from one source; never reversible back to the IP.
 */
export async function hashIp(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
