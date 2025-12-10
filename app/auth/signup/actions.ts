'use server'
import { createClient } from "@/app/lib/supabaseServerClient"
import { redirect } from "next/navigation"
import { setLanguage, translateErrorCode } from "supabase-error-translator-js";

setLanguage('es'); 


export async function signup(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm_password = formData.get('confirm_password') as string;

    let message:string = '';

    if(confirm_password!==password){
        redirect('/auth/signup?error=' + encodeURIComponent('Las contraseñas no coinciden'));
    }
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                "role": "owner",
                "profile_completed": false,
                "subscription_active": false
            }
        }
    })
    if (error) {
        if(error.code==='anonymous_provider_disabled' || error.code === 'validation_failed'){
            message = 'Verifique que los datos sean correctos'
        }else{
            message = translateErrorCode(error.code, 'auth')
        }
        
        
        redirect('/auth/signup?error=' + encodeURIComponent(message))
    }
    redirect('/auth/activate?email=' + encodeURIComponent(email))
}