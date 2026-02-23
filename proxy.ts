import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/config/firebase";

// console.log(auth.currentUser)

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

//    if((pathname.includes('/login') || pathname.includes('/signup'))) {
//      return NextResponse.redirect(new URL('/app/feed', req.url))
// //    }

//   if (pathname.includes("/app/feed")) {
//     return NextResponse.next();
//   } 



}

export const config = {
  matcher: ["/app/:path*"],
};
