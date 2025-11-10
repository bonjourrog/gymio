'use client'
import { toast } from "sonner";
import { FormEvent } from "react";
import { login } from "../../action"
import { ApiResponse } from "@/app/types/api";
import Link from "next/link";

export default function SigninForm() {

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const form = event.currentTarget;
            const formData = new FormData(form);
            const res: ApiResponse = await login(formData)
            if (!res.success) {
                if (res.code === 'invalid_credentials') {
                    toast.error('Verifique sus datos')
                    return
                }
                throw new Error(res.message)
            }

        } catch (error: any) {
            console.log('ocurrio un error en sign in form component');
        }

    }
    return <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96 p-10 rounded-2xl border border-zinc-200">
        <label htmlFor="email">
            Correo
            <input type="email" name="email" id="email" />
        </label>
        <label htmlFor="password">
            Contraseña
            <input type="password" name="password" id="password" />
        </label>
        <button className="p-3 rounded-lg bg-zinc-800 text-white cursor-pointer">Iniciar sesión</button>
        <p className="flex gap-1 justify-center mt-10 text-zinc-500">
            Eres dueño de gimnasio
            <Link href='/auth/signup' className="underline text-blue-400">Registrate</Link>
        </p>
    </form>
}