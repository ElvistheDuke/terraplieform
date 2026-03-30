export const COOKIE_NAME = "admin_session";

function hexEncode(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signPayload(
  payload: string,
  secret: string
): Promise<string> {
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return `${payload}.${hexEncode(sig)}`;
}

export async function verifySession(
  cookieValue: string | undefined,
  secret: string
): Promise<boolean> {
  if (!cookieValue) return false;
  const lastDot = cookieValue.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = cookieValue.slice(0, lastDot);
  const candidateHex = cookieValue.slice(lastDot + 1);
  if (payload !== "admin") return false;

  const key = await getKey(secret);
  const candidateBytes = new Uint8Array(
    candidateHex.match(/.{2}/g)!.map((b) => parseInt(b, 16))
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    candidateBytes,
    new TextEncoder().encode(payload)
  );
}
