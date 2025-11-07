'use server'
import { signup } from "./actions";


interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export default async function SignUpPage({ searchParams }: {searchParams:SearchParams}) {
    let {error} =  await searchParams;
    return <main className="flex items-center justify-center h-screen">
        <form action={signup} className="flex flex-col gap-4 w-96 p-10 rounded-2xl border border-zinc-200 bg-linear-to-b from-blue-200 via-white to-white">
        {error && <div className="text-red-400 font-bold">{error}</div>}
            <label htmlFor="gym_name">
                Nombre del gymnasio
                <input type="text" name="gym_name" id="gym_name" />
            </label>
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
            <label htmlFor="phone">
                Telefono
                <input type="tel" name="phone" id="phone" />
            </label>
            <button className="cursor-pointer">Registrarse</button>
        </form>
    </main>
}
