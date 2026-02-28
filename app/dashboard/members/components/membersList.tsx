import { Customer } from "@/app/entity/customer";
import { useCustomerStore } from "@/app/store/customerStore";
import { Phone, User2, CheckCircle2, Clock, AlertTriangle, XCircle, Ban } from 'lucide-react';
import { handlePriceFormat, spanishFormat } from '@/app/lib/formatting';
import { useCheckinActions } from "@/app/hooks/useCheckinActions";
import dayjs from 'dayjs';
import { useMemo } from 'react';
import styles from './membersList.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// Status chip — same logic as membersTable for consistency
// ─────────────────────────────────────────────────────────────────────────────
function getStatusConfig(membership: any) {
    const rawStatus = membership?.status?.toLowerCase?.() ?? ''

    if (rawStatus.includes('activ'))
        return { label: 'Activa', icon: <CheckCircle2 size={11} strokeWidth={2.5} />, variant: 'active' }
    if (rawStatus.includes('por') && rawStatus.includes('venc'))
        return { label: 'Por vencer', icon: <AlertTriangle size={11} strokeWidth={2.5} />, variant: 'expiring' }
    if (rawStatus.includes('venc'))
        return { label: 'Vencida', icon: <XCircle size={11} strokeWidth={2.5} />, variant: 'expired' }
    if (rawStatus.includes('cancel'))
        return { label: 'Cancelada', icon: <Ban size={11} strokeWidth={2.5} />, variant: 'cancelled' }

    if (membership?.end_date) {
        const daysLeft = Math.ceil((new Date(membership.end_date).getTime() - Date.now()) / 86400000)
        if (daysLeft < 0)  return { label: 'Vencida',    icon: <XCircle size={11} strokeWidth={2.5} />,      variant: 'expired'  }
        if (daysLeft <= 5) return { label: 'Por vencer', icon: <AlertTriangle size={11} strokeWidth={2.5} />, variant: 'expiring' }
        return { label: 'Activa', icon: <CheckCircle2 size={11} strokeWidth={2.5} />, variant: 'active' }
    }
    return { label: 'Cancelada', icon: <Ban size={11} strokeWidth={2.5} />, variant: 'cancelled' }
}

function StatusChip({ membership }: { membership: any }) {
    const { label, icon, variant } = getStatusConfig(membership)
    return (
        <span className={`${styles.statusChip} ${styles[`status_${variant}`]}`}>
            {icon}{label}
        </span>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Attendance dot per member row
// ─────────────────────────────────────────────────────────────────────────────
function AttendanceDot({ customerId }: { customerId: string }) {
    const { isCheckedIn } = useCheckinActions()
    const checked = isCheckedIn(customerId)
    return (
        <span className={`${styles.attendanceDot} ${checked ? styles.dotPresent : styles.dotAbsent}`}
            title={checked ? 'Check-in hoy' : 'Sin check-in'}>
            {checked
                ? <><CheckCircle2 size={11} strokeWidth={2.2} /> Hoy</>
                : <><Clock size={11} strokeWidth={2} /> Sin check-in</>
            }
        </span>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Days remaining badge
// ─────────────────────────────────────────────────────────────────────────────
function DaysRemaining({ endDate }: { endDate: string | undefined }) {
    if (!endDate) return <span className={styles.daysNull}>—</span>
    const days = dayjs(endDate).diff(dayjs(), 'day')
    const urgent = days <= 5
    return (
        <span className={`${styles.daysBadge} ${urgent ? styles.daysUrgent : styles.daysNormal}`}>
            {days < 0 ? 'Vencida' : `${days}d`}
        </span>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function MembersList() {
    const { customers } = useCustomerStore()
    const allowedStatuses = ['active', 'expired']

    const customerList = useMemo(() => {
        return customers
            .filter(c =>
                c.membership_customers?.some(mc =>
                    allowedStatuses.includes(mc.memberships?.status as string)
                )
            )
            .map(customer => ({
                ...customer,
                membership_customers: customer.membership_customers?.filter(mc =>
                    allowedStatuses.includes(mc.memberships?.status as string)
                ) ?? []
            }))
            .reduce((acc, customer) => {
                const activeMembership = customer.membership_customers?.[0]
                const key = activeMembership?.memberships?.id || 'Sin membresía'
                if (!acc[key]) acc[key] = []
                acc[key].push(customer)
                return acc
            }, {} as Record<string, Customer[]>)
    }, [customers, allowedStatuses])

    return (
        <div className={styles.listWrapper}>
            {Object.entries(customerList).map(([membershipId, members]) => {
                const membership = members[0].membership_customers?.[0]?.memberships
                const pkg = membership?.packages

                return (
                    <div key={membershipId} className={styles.group}>

                        {/* ── Membership header row ── */}
                        <div className={styles.groupHeader}>
                            <div className={styles.groupAccent} />

                            <div className={styles.groupCols}>
                                {/* Plan */}
                                <div className={styles.groupCol}>
                                    <span className={styles.colLabel}>Plan</span>
                                    <span className={styles.colValue}>{pkg?.name || membershipId}</span>
                                </div>

                                {/* Precio */}
                                <div className={styles.groupCol}>
                                    <span className={styles.colLabel}>Precio</span>
                                    <span className={styles.colValue}>{handlePriceFormat(`${pkg?.price}`)}</span>
                                </div>

                                {/* Inicio */}
                                <div className={`${styles.groupCol} ${styles.hideMobile}`}>
                                    <span className={styles.colLabel}>Inicio</span>
                                    <span className={styles.colValue}>{spanishFormat(dayjs(membership?.start_date))}</span>
                                </div>

                                {/* Status */}
                                <div className={styles.groupCol}>
                                    <span className={styles.colLabel}>Status</span>
                                    <StatusChip membership={membership} />
                                </div>

                                {/* Días restantes */}
                                <div className={`${styles.groupCol} ${styles.hideMobile}`}>
                                    <span className={styles.colLabel}>Días restantes</span>
                                    <DaysRemaining endDate={membership?.end_date} />
                                </div>
                            </div>
                        </div>

                        {/* ── Members list ── */}
                        <ul className={styles.memberList}>
                            {members.map(member => (
                                <li key={member.id} className={styles.memberRow}>
                                    <div className={styles.memberLeft}>
                                        {/* <span className={styles.memberAvatar}>
                                            {member.name?.charAt(0).toUpperCase()}
                                        </span> */}
                                        <span className={styles.memberName}>
                                            <User2 size={12} strokeWidth={1.8} className={styles.memberIcon} />
                                            {member.name}
                                        </span>
                                        <span className={styles.memberPhone}>
                                            <Phone size={12} strokeWidth={1.8} className={styles.memberIcon} />
                                            {member.phone}
                                        </span>
                                    </div>
                                    <AttendanceDot customerId={member.id!} />
                                </li>
                            ))}
                        </ul>

                    </div>
                )
            })}

            {Object.keys(customerList).length === 0 && (
                <div className={styles.empty}>No hay membresías activas o vencidas.</div>
            )}
        </div>
    )
}