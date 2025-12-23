import { Rocket } from "lucide-react";
import Image from "next/image";

export default function Hero() {
    return <section className="hero">
        <Image
            src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80'
            alt="Hero background"
            fill
            priority
            className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 h-[calc(100%-6rem)] flex justify-center flex-col gap-10 pl-20 z-10 w-[55rem] text-white">
            <h3 className="flex items-center gap-2 bg-white/25 w-fit rounded-full px-4 py-2 font-bold">
                <Rocket/>
                Sistema mvp en desarrollo
            </h3>
            <h1 className="text-8xl font-bold">Gestiona tu gimnasio de forma inteligente</h1>
            <p className="text-2xl">Simplifica el check-in, administra suscripciones y paquetes en una sola plataforma moderna. </p>
            <div className="flex gap-4 font-bold">
                <button className="py-4 px-10 rounded-full  bg-white text-zinc-800">Prueba gratis 1 mes</button>
                <button className="py-4 px-10 rounded-full border-2 border-white text-white">DEMO</button>
            </div>
            <ul className="flex gap-6">
                <li className="text-center">
                    <strong className="font-bold text-4xl">98%</strong>
                    <p>Satisfacción</p>
                </li>
                <li className="text-center">
                    <strong className="font-bold text-4xl">500+</strong>
                    <p>Check-ins diarios</p>
                </li>
                <li className="text-center">
                    <strong className="font-bold text-4xl">24/7</strong>
                    <p>Soporte</p>
                </li>
            </ul>

        </div>
    </section>
}