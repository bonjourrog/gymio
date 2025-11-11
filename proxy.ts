import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./app/lib/supabaseServerClient";

export default async function middleware(req: NextRequest) {

    const supabase = await createClient();
    const { data: {user} } = await supabase.auth.getUser();

    // descomentar esto para activar suscripcion de los socios
    // await supabase.auth.updateUser({
    //     data: { subscription_active: true }
    // })

    const url = req.nextUrl;
    const pathname = url.pathname;
    const isAuthRoute = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup");
    const isProtectedRoute = pathname.startsWith("/dashboard")
    
    if (!user) {
        if(isProtectedRoute){
            url.pathname = "/auth/signin";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }
    if(isAuthRoute){
        url.pathname = "/dashboard"
        return NextResponse.redirect(url);
    }
    if(!user.user_metadata?.profile_completed && pathname!=='/auth/onboarding'){
        url.pathname = '/auth/onboarding'
        return NextResponse.redirect(url);
    }
    if(!user.user_metadata?.subscription_active && pathname !== "/billing"){
        url.pathname = '/billing'
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/signin", "/auth/signup", "/billing/:path*"],
};