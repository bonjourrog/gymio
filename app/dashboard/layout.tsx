'use client'
import { usePathname } from 'next/navigation';
import styles from './style.module.css';
import { DollarSign, LayoutDashboard, LucideBoxes, PieChart, Settings, Users, LogOut, ChevronDown, Dumbbell } from "lucide-react";
import Link from 'next/link';
import { logout } from '../actions/logout/action';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../hooks/useUser';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/members', label: 'Miembros', icon: Users },
    { href: '/dashboard/payments', label: 'Pagos', icon: DollarSign },
    { href: '/dashboard/packages', label: 'Paquetes', icon: LucideBoxes },
    { href: '/dashboard/reports', label: 'Reporte', icon: PieChart },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
]

const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/members': 'Miembros',
    '/dashboard/payments': 'Pagos',
    '/dashboard/packages': 'Paquetes',
    '/dashboard/reports': 'Reporte',
    '/dashboard/settings': 'Configuración',
}

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { getUsers } = useUser();
    const pathName = usePathname();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathName === '/dashboard'
        return pathName.startsWith(href)
    }

    const pageTitle = pageTitles[pathName] ?? 'Dashboard';

    const handleLogout = async () => {
        await logout()
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <main className={styles.layout}>
            {/* ── Sidebar ── */}
            <nav className={styles.navbar}>
                {/* Logo */}
                <div className={styles.logo}>
                    <span className={styles.logoIcon}><Dumbbell size={16} strokeWidth={2} /></span>
                    <span className={styles.logoText}>GYM PRO</span>
                </div>

                {/* Nav label */}
                <p className={styles.navSection}>Menú</p>

                {/* Nav items */}
                <ul className={styles.navList}>
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href)
                        return (
                            <li key={href} className={`${styles.navbar__item} ${active ? styles['navbar__item--active'] : styles['navbar__item--deactive']}`}>
                                <Link
                                    href={href}
                                    className={styles.navbar__link}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <span className={styles.navIcon}><Icon size={15} strokeWidth={active ? 2.2 : 1.8} /></span>
                                    <p>{label}</p>
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Sidebar footer */}
                <div className={styles.navFooter}>
                    <span className={styles.planBadge}>Plan Free</span>
                </div>
            </nav>

            {/* ── Main content ── */}
            <section className={styles.mainContent}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>{pageTitle}</h1>

                    {/* Profile dropdown */}
                    <div className={styles.profileWrapper} ref={profileRef}>
                        <button
                            className={styles.profileBtn}
                            onClick={() => setProfileOpen(prev => !prev)}
                            aria-expanded={profileOpen}
                        >
                            <span className={styles.avatar}>R</span>
                            <span className={styles.profileName}>Perfil</span>
                            <ChevronDown
                                size={14}
                                strokeWidth={2}
                                className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ''}`}
                            />
                        </button>

                        {profileOpen && (
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownUser}>
                                    <span className={styles.dropdownAvatar}>R</span>
                                    <div>
                                        <p className={styles.dropdownName}>Usuario</p>
                                        <span className={styles.dropdownPlan}>Plan Free</span>
                                    </div>
                                </div>
                                <hr className={styles.dropdownDivider} />
                                <button className={styles.dropdownItem} onClick={handleLogout}>
                                    <LogOut size={14} strokeWidth={1.8} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page content */}
                <div className={styles.pageContent}>
                    {children}
                </div>
            </section>
        </main>
    )
}