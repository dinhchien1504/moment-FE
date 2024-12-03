import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { FetchServerPostApiNoToken } from './api/fetch_server_api';
import API from './api/api';
import { getSessionId } from "@/utils/session_store";
export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname; // Lấy path hiện tại

  // Kiểm tra xem yêu cầu có phải là yêu cầu call api
  const isHTMLRequest = request.headers.get('accept')?.includes('text/x-component');

  // Nếu yêu cầu là call api thì bỏ qua
  if (isHTMLRequest) {
    return NextResponse.next();
  }

  // bỏ qua các call api và load trang khi đang ở /login
  if (currentPath === "/login") {
    const res = await FetchServerPostApiNoToken(API.AUTH.INTROSPECT, getSessionId())
    if (res.status !== 401) { return NextResponse.redirect(new URL('/', request.url)) }
    return NextResponse.next();
  }

  console.log("fetch api introspect");

  if (getSessionId() === undefined) { return NextResponse.redirect(new URL('/login', request.url)) }
  const res = await FetchServerPostApiNoToken(API.AUTH.INTROSPECT, getSessionId())
  if (res.status === 401) { return NextResponse.redirect(new URL('/login', request.url)) }



}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)',
  ],

}