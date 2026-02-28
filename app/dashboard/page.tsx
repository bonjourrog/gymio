'use client'

import styles from './style.module.css';
import { Check, CheckCircle2, DollarSign, Plus, TriangleAlert, Users2Icon } from "lucide-react";
import { useState } from 'react';
import NewSubForm from '../components/newSubForm';
import { useCheckin } from '../hooks/useCheckin';
import { toast } from 'sonner';
import { useCheckinStore } from '../store/checkin';
import CheckinModal from '../components/checkin';
import MembershipTable from './members/components/membersTable';
import { getMembershipColor } from '../lib/utils';

export default function Home() {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showCheckin, setShowCheckin] = useState<boolean>(false);
    const { getAllCheckin } = useCheckin();
    const customerCheckIns = useCheckinStore(s => s.customerCheckIns);
    const getColorForTable = (membershipId?: string) => getMembershipColor({}, membershipId);

    const handleShowNewUserform = () => setShowForm(true);

    const handleCheckin = async () => {
        try {
            setShowCheckin(true);
            await getAllCheckin();
        } catch (error) {
            toast.error("Error al cargar la lista de asistencia. Recargue la pagina");
        }
    };

    const checkinCount = customerCheckIns.filter(c => c.checkin.check_in_date !== '').length;

    const gadgets = [
        {
            icon: <Users2Icon size={20} strokeWidth={1.5} />,
            value: "17",
            label: "Miembros activos",
            sub: "↑ 12% este mes",
            accent: "#4f46e5",
            accentBg: "rgba(79,70,229,0.07)",
            accentBorder: "rgba(79,70,229,0.2)",
        },
        {
            icon: <CheckCircle2 size={20} strokeWidth={1.5} />,
            value: String(checkinCount),
            label: "Check-in hoy",
            sub: "Promedio: 7",
            accent: "#16a34a",
            accentBg: "rgba(22,163,74,0.07)",
            accentBorder: "rgba(22,163,74,0.2)",
        },
        {
            icon: <DollarSign size={20} strokeWidth={1.5} />,
            value: "$2.5K",
            label: "Ingresos mes",
            sub: "↑ 5% vs anterior",
            accent: "#b45309",
            accentBg: "rgba(245,158,11,0.08)",
            accentBorder: "rgba(245,158,11,0.25)",
        },
        {
            icon: <TriangleAlert size={20} strokeWidth={1.5} />,
            value: "4",
            label: "Por vencer",
            sub: "Próximos días",
            accent: "#dc2626",
            accentBg: "rgba(239,68,68,0.06)",
            accentBorder: "rgba(239,68,68,0.2)",
        },
    ];

    const actions = [
        { icon: <Plus size={15} strokeWidth={2.2} />, label: "Nueva suscripción", onClick: handleShowNewUserform },
        { icon: <Check size={15} strokeWidth={2.2} />, label: "Check-in", onClick: handleCheckin },
        { icon: <DollarSign size={15} strokeWidth={2.2} />, label: "Registrar Pago", onClick: () => {} },
    ];

    return (
        <>
            {showForm ? (
                <div className='fixed inset-0 flex items-center justify-center w-screen h-full bg-black/20 z-10 backdrop-blur-sm'>
                    <NewSubForm onClose={() => setShowForm(false)} />
                </div>
            ) : null}

            {showCheckin ? (
                <div
                    onClick={(e) => e.target === e.currentTarget && setShowCheckin(false)}
                    className='fixed top-0 left-0 flex items-center justify-center w-[calc(100%-13em)] h-full bg-black/20 z-10 backdrop-blur-sm'
                >
                    <CheckinModal />
                </div>
            ) : null}

            <section className={styles.home}>

                {/* ── Quick Actions ── */}
                <ul className={styles.actionsRow}>
                    {actions.map((a) => (
                        <li key={a.label}>
                            <button className={styles.action} onClick={a.onClick}>
                                <span className={styles.actionIcon}>{a.icon}</span>
                                <span className={styles.actionLabel}>{a.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* ── Stat Cards ── */}
                <ul className={styles.gadgets}>
                    {gadgets.map((g) => (
                        <li
                            key={g.label}
                            className={styles.gadget}
                            style={{
                                '--card-accent': g.accent,
                                '--card-accent-bg': g.accentBg,
                                '--card-accent-border': g.accentBorder,
                            } as React.CSSProperties}
                        >
                            <span className={styles.gadgetIcon}>{g.icon}</span>
                            <strong className={styles.gadgetValue}>{g.value}</strong>
                            <div className={styles.gadgetMeta}>
                                <p className={styles.gadgetLabel}>{g.label}</p>
                                <p className={styles.gadgetSub}>{g.sub}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* ── Members Table ── */}
                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Miembros</h2>
                    </div>
                    <div className={styles.tableBody}>
                        <MembershipTable getMembershipColor={getColorForTable} />
                    </div>
                </div>

            </section>
        </>
    );
}