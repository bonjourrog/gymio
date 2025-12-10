'use server'
import { createClient } from "@/app/lib/supabaseServerClient";
import { ApiResponse } from "@/app/types/api";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient()
    const data = { email: formData.get('email') as string, password: formData.get('password') as string, }
    const { error, data: userData } = await supabase.auth.signInWithPassword(data)
    if (error) {
        const res: ApiResponse = {
            message: error.message,
            success: false,
            code: error.code,
        }
        return res;
    }
    const user = userData.user
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    if(!profile)redirect('/auth/onboarding')
    redirect('/dashboard')
}
