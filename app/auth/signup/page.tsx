'use server'
import Link from "next/link";
import { signup } from "./actions";


interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export default async function SignUpPage({ searchParams }: {searchParams:SearchParams}) {
    let {error} =  await searchParams;
    return <main className="flex items-center justify-center h-screen">
        <form action={signup} className="flex flex-col gap-4 w-96 p-10 rounded-2xl border border-zinc-200">
        <h2 className="text-3xl font-bold">Registro</h2>
        {error && <div className="text-red-400 font-bold">{error}</div>}
            <label htmlFor="email">
                Correo
                <input type="email" name="email" id="email" />
            </label>
            <label htmlFor="password">
                Contraseña
                <input type="password" name="password" id="password" />
            </label>
            <label htmlFor="confirm_password">
                Confirmar contraseña
                <input type="password" name="confirm_password" id="confirm_password" />
            </label>
            <button className="p-3 rounded-lg bg-zinc-800 text-white cursor-pointer">Registrarse</button>
            <Link className="mx-auto" href='/auth/signin'>Iniciar sesión</Link>
        </form>
    </main>
}
