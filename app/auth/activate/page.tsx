'use client'
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation"

export default function ActivatePage() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || '';
    return <main className="flex flex-col items-center justify-center h-screen">
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="text-center">
                    {/* Icon Container */}
                    <div className="flex justify-center mb-10">
                        <div className="relative">
                            <div className="bg-slate-900/5 p-6 rounded-2xl backdrop-blur-sm border border-slate-200/30">
                                <Mail className="w-12 h-12 text-slate-900" strokeWidth={1.2} />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4 tracking-tight">
                            Verifica tu email
                        </h1>
                        <p className="text-slate-600 text-lg leading-relaxed font-light">
                            Hemos enviado un enlace de verificación a tu dirección de correo. Por favor, revisa tu bandeja de entrada para completar tu registro.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 mb-16">
                        <div className="flex gap-5 items-start">
                            <div className="hrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/10 text-slate-900 text-sm font-light">
                                    1
                                </div>
                            </div>
                            <p className="text-slate-700 text-base pt-0.5 font-light text-left">
                                Abre el correo que te enviamos
                            </p>
                        </div>
                        <div className="flex gap-5 items-start">
                            <div className="shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/10 text-slate-900 text-sm font-light">
                                    2
                                </div>
                            </div>
                            <p className="text-slate-700 text-base pt-0.5 font-light text-left">
                                Haz clic en el botón de verificación
                            </p>
                        </div>
                        <div className="flex gap-5 items-start">
                            <div className="shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/10 text-slate-900 text-sm font-light">
                                    3
                                </div>
                            </div>
                            <p className="text-slate-700 text-base pt-0.5 font-light text-left">
                                ¡Listo! Tu cuenta estará activada
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-200/50 mb-8"></div>

                    {/* Footer Info */}
                    <div className="space-y-3">
                        <p className="text-slate-500 text-sm font-light leading-relaxed">
                            El enlace de verificación expirará en 1 hora.
                        </p>
                        <p className="text-slate-400 text-sm font-light">
                            {/* Si tienes problemas, contáctanos en soporte@ejemplo.com */}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        {/* <h2 className="text-4xl font-bold mb-4">¡Cuenta creada!</h2>
        <p className="mb-2">
            Te enviamos un correo de confirmacion a {email}
        </p>
        <p>
            Por favor, revisa tu correo y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.
        </p> */}
    </main>
}