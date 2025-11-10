import { createClient } from "./supabaseServerClient";

export async function getSession(){
    const supabase = await createClient()
    const {data} = await supabase.auth.getSession()
    return data.session

}