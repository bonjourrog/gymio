'use client'
import { usePathname } from 'next/navigation';
import styles from './style.module.css';
import { DollarSign, LayoutDashboard, LucideBoxes, Menu, PieChart, Settings, Users, X } from "lucide-react";
import Link from 'next/link';
import { logout } from '../actions/logout/action';
import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/members', label: 'Miembros', icon: Users },
    { href: '/dashboard/payments', label: 'Pagos', icon: DollarSign },
    { href: '/dashboard/packages', label: 'Paquetes', icon: LucideBoxes },
    { href: '/dashboard/reports', label: 'Reporte', icon: PieChart },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
]

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const {getUsers} = useUser();
    const pathName = usePathname();
    const isActive = (href: string) => {
        if (href === '/dashboard') return pathName === '/dashboard'
        return pathName.startsWith(href)
    }
    const handleLogout = async()=>{
        await logout()
    }
    
    useEffect(()=>{
        getUsers();
    },[])
    return <main className="flex max-h-screen overflow-hidden h-screen text-zinc-700">
        <input type="checkbox" id="menu-toggle" className={styles["menu-checkbox"]}/>
        <label htmlFor="menu-toggle" className={styles["menu-icon"]}>☰</label>
        <nav className={styles.navbar}>
            <ul className='flex flex-col gap-2 h-full'>
                <li className={styles.logo}>GYM PRO</li>
                {navItems.map(({ href, label, icon: Icon })=>{
                    const active = isActive(href)
                    return (
                        <li key={href}
                            className={`${styles['navbar__item']} ${active ? styles['navbar__item--active'] : styles['navbar__item--deactive']}`}>
                            <Link href={href} 
                                className={styles['navbar__link']}
                                aria-current={active ? 'page' : undefined}
                                >
                                <Icon size={15}/>
                                <p>{label}</p>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
        <section className="w-full">
            <header className="flex justify-between p-10">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <button onClick={handleLogout}>Cerrar sesion</button>
                <div className="flex items-center gap-2 p-3 rounded-full bg-zinc-100">
                    <span className="flex items-center justify-center w-8 h-8 bg-zinc-900 text-white rounded-full text-sm font-semibold">R</span>
                    <p>Perfil</p>
                </div>
            </header>
            {children}
        </section>
    </main>
}