// action.ts
"use server"
import { createClient } from "@/app/lib/supabaseServerClient"
import { redirect } from "next/navigation"

export async function createProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from("profiles").insert({
        id: user?.id,
        gym_name: formData.get("gym_name"),
        full_name:formData.get("full_name"),
        phone: formData.get("phone"),
        role: "owner"
    })

    await supabase.auth.updateUser({
    data: { profile_completed: true }
    })

    redirect("/dashboard")
}