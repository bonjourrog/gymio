'use client'

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <header className={`fixed flex justify-between items-center w-full px-20 p-10 z-20 ${isOpen?'text-black':'text-white'}`}>
            <p className="block font-black text-xl">GYMIO</p>

            <button
                className="block md:hidden z-30"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                {isOpen ? <X /> : <Menu />}
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`
            fixed md:relative
            top-0 md:top-auto
            left-0 md:left-auto
            w-full
            h-screen md:h-auto
            bg-white md:bg-transparent
            z-20
            flex flex-col md:flex-row
            gap-8 md:gap-4
            justify-center md:justify-between
            items-center
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
            >
                <ul className="flex gap-6 md:flex-row flex-col text-center mx-auto">
                    <li>
                        <Link
                            href="#"
                            onClick={() => setIsOpen(false)}
                            className="block py-2"
                        >
                            Caracteristicas
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            onClick={() => setIsOpen(false)}
                            className="block py-2"
                        >
                            Precios
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            onClick={() => setIsOpen(false)}
                            className="block py-2"
                        >
                            QA
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            onClick={() => setIsOpen(false)}
                            className="block py-2"
                        >
                            Contacto
                        </Link>
                    </li>
                </ul>
                <div className="flex items-center gap-10">
                <p>Log in</p>
                    <Link
                    href='/dashboard'
                    className="p-2 px-6 rounded-lg bg-white text-zinc-800"
                    onClick={() => setIsOpen(false)}
                >
                    Comenzar
                </Link>
                </div>
            </div>
        </header>
    );
}