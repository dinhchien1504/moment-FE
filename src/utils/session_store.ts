import "server-only";
import { cookies } from "next/headers";

type SessionId = string;

export function getSessionId(): SessionId | undefined {
  const cookieStore = cookies();
  return cookieStore.get("session-id")?.value;
}

export function setSessionId(sessionId: SessionId): void {
  const cookieStore = cookies();
  cookieStore.set("session-id", sessionId,{
    path: "/",
    maxAge: 60 * 60 * 24 * 30});
}

export function getSessionIdAndCreateIfMissing() {
  const sessionId = getSessionId();
  if (!sessionId) {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);

    return newSessionId;
  }

  return sessionId;
}

export function removeSessionId(): void {
  const cookieStore = cookies();
  cookieStore.delete("session-id");
}