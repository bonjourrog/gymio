'use client'
import { useSearchParams } from "next/navigation"

export default function ActivatePage() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')||'';
    return <main className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-4xl font-bold mb-4">¡Cuenta creada!</h2>
        <p className="mb-2">
            Te enviamos un correo de confirmacion a {email}
        </p>
        <p>
            Por favor, revisa tu correo y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.
        </p>
    </main>
}