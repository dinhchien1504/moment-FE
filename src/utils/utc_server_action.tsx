
'use server';
export async function getServerUTC(): Promise<string> {
  return new Date().toISOString(); // Lấy thời gian UTC từ server
}