import { handlePriceFormat } from "@/app/lib/formatting"
import { Phone, X, Calendar, DollarSign, User, CheckCircle2, XCircle, Clock, AlertTriangle, Ban } from "lucide-react"
import { useCustomerStore } from "@/app/store/customerStore"
import { useState } from "react"
import styles from "./membersTable.module.css"

// ── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentWeekDays(): Date[] {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return d
    })
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getMockAttendance(customerId: string): Set<string> {
    const week = getCurrentWeekDays()
    const attended = new Set<string>()
    week.forEach((day) => {
        const seed = (customerId.charCodeAt(0) + day.getDate()) % 3
        if (seed !== 0) attended.add(day.toDateString())
    })
    return attended
}

function todayStr() {
    return new Date().toDateString()
}

// ── Membership status chip (replaces MembershipStatus component) ─────────────
type StatusType = 'activa' | 'cancelada' | 'vencida' | 'por vencer' | string

function getStatusConfig(customer: any): { label: string; icon: React.ReactNode; variant: string } {
    // Try to derive status from membership data — adjust field names to match your entity
    const membership = customer.membership_customers?.[0]?.memberships
    const rawStatus = membership?.status?.toLowerCase?.() ?? ''

    if (rawStatus.includes('activ')) {
        return { label: 'Activa', icon: <CheckCircle2 size={11} strokeWidth={2.5} />, variant: 'active' }
    }
    if (rawStatus.includes('venc') && rawStatus.includes('por')) {
        return { label: 'Por vencer', icon: <AlertTriangle size={11} strokeWidth={2.5} />, variant: 'expiring' }
    }
    if (rawStatus.includes('venc')) {
        return { label: 'Vencida', icon: <XCircle size={11} strokeWidth={2.5} />, variant: 'expired' }
    }
    if (rawStatus.includes('cancel')) {
        return { label: 'Cancelada', icon: <Ban size={11} strokeWidth={2.5} />, variant: 'cancelled' }
    }
    // fallback — if no status field, check expiry date
    if (membership?.end_date) {
        const end = new Date(membership.end_date)
        const now = new Date()
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (daysLeft < 0)  return { label: 'Vencida',    icon: <XCircle size={11} strokeWidth={2.5} />,      variant: 'expired'   }
        if (daysLeft <= 5) return { label: 'Por vencer', icon: <AlertTriangle size={11} strokeWidth={2.5} />, variant: 'expiring'  }
        return { label: 'Activa', icon: <CheckCircle2 size={11} strokeWidth={2.5} />, variant: 'active' }
    }
    return { label: 'Cancelada', icon: <Ban size={11} strokeWidth={2.5} />, variant: 'cancelled' }
}

function StatusChip({ customer, size = 'sm' }: { customer: any; size?: 'sm' | 'md' }) {
    const { label, icon, variant } = getStatusConfig(customer)
    return (
        <span className={`${styles.statusChip} ${styles[`status_${variant}`]} ${size === 'md' ? styles.statusChipMd : ''}`}>
            {icon}
            {label}
        </span>
    )
}

// ── Attendance mini-chip ─────────────────────────────────────────────────────
function AttendanceChip({ customerId }: { customerId: string }) {
    const attended = getMockAttendance(customerId)
    const checkedToday = attended.has(todayStr())
    return (
        <span className={`${styles.attendanceChip} ${checkedToday ? styles.chipPresent : styles.chipAbsent}`}>
            {checkedToday
                ? <><CheckCircle2 size={12} strokeWidth={2} /> Hoy</>
                : <><Clock size={12} strokeWidth={2} /> Sin check-in</>
            }
        </span>
    )
}

// ── Weekly heatmap ────────────────────────────────────────────────────────────
function WeeklyHeatmap({ customerId }: { customerId: string }) {
    const week = getCurrentWeekDays()
    const attended = getMockAttendance(customerId)
    const today = new Date().toDateString()

    return (
        <div className={styles.heatmap}>
            <div className={styles.heatmapGrid}>
                {week.map((day, i) => {
                    const isToday = day.toDateString() === today
                    const present = attended.has(day.toDateString())
                    const isFuture = day > new Date()
                    return (
                        <div key={i} className={styles.heatmapCell}>
                            <span className={styles.heatmapDayLabel}>{DAY_LABELS[i]}</span>
                            <div
                                className={[
                                    styles.heatmapBlock,
                                    present ? styles.blockPresent : '',
                                    isToday ? styles.blockToday : '',
                                    isFuture ? styles.blockFuture : '',
                                    !present && !isFuture ? styles.blockAbsent : '',
                                ].join(' ')}
                                title={`${DAY_LABELS[i]} ${day.getDate()}/${day.getMonth() + 1} — ${present ? 'Asistió' : isFuture ? 'Próximo' : 'No asistió'}`}
                            />
                        </div>
                    )
                })}
            </div>
            <div className={styles.heatmapLegend}>
                <span className={styles.legendDot} data-type="present" /> Asistió
                <span className={styles.legendDot} data-type="absent" /> No asistió
                <span className={styles.legendDot} data-type="future" /> Próximo
            </div>
        </div>
    )
}

// ── Member Detail Modal ───────────────────────────────────────────────────────
function MemberModal({ customer, onClose }: { customer: any; onClose: () => void }) {
    const membership = customer.membership_customers?.[0]?.memberships
    const pkg = membership?.packages
    const attended = getMockAttendance(customer.id)
    const week = getCurrentWeekDays()
    const daysThisWeek = week.filter(d => attended.has(d.toDateString())).length
    const checkedToday = attended.has(todayStr())

    return (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal} role="dialog" aria-modal="true">

                {/* ── Header ── */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalAvatar}>
                        {customer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.modalUserInfo}>
                        <h2 className={styles.modalName}>{customer.name}</h2>
                        <span className={styles.modalPhone}>
                            <Phone size={11} strokeWidth={1.8} />
                            {customer.phone}
                        </span>
                    </div>
                    <StatusChip customer={customer} size="md" />
                    <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
                        <X size={15} strokeWidth={2} />
                    </button>
                </div>

                {/* ── Quick stats — 2x2 grid, never overflows ── */}
                <div className={styles.modalStats}>
                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color="blue">
                            <Calendar size={13} />
                        </span>
                        <div>
                            <p className={styles.modalStatValue}>{daysThisWeek} / 7</p>
                            <p className={styles.modalStatLabel}>Esta semana</p>
                        </div>
                    </div>

                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color={checkedToday ? 'green' : 'red'}>
                            {checkedToday ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        </span>
                        <div>
                            <p className={styles.modalStatValue}>{checkedToday ? 'Presente' : 'Ausente'}</p>
                            <p className={styles.modalStatLabel}>Hoy</p>
                        </div>
                    </div>

                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color="amber">
                            <DollarSign size={13} />
                        </span>
                        <div>
                            <p className={styles.modalStatValue}>{handlePriceFormat(`${pkg?.price}`)}</p>
                            <p className={styles.modalStatLabel}>Precio plan</p>
                        </div>
                    </div>

                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color="purple">
                            <User size={13} />
                        </span>
                        <div>
                            <p className={styles.modalStatValue}>{pkg?.name ?? '—'}</p>
                            <p className={styles.modalStatLabel}>Plan</p>
                        </div>
                    </div>
                </div>

                {/* ── Attendance heatmap ── */}
                <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>Asistencia semanal</h3>
                    <WeeklyHeatmap customerId={customer.id} />
                </div>

                {/* ── Membership details ── */}
                {membership && (
                    <div className={styles.modalSection}>
                        <h3 className={styles.modalSectionTitle}>Membresía</h3>
                        <div className={styles.modalDetails}>
                            {pkg?.name && (
                                <div className={styles.modalDetailRow}>
                                    <span className={styles.modalDetailLabel}>Plan</span>
                                    <span className={styles.modalDetailValue}>{pkg.name}</span>
                                </div>
                            )}
                            {pkg?.price != null && (
                                <div className={styles.modalDetailRow}>
                                    <span className={styles.modalDetailLabel}>Precio</span>
                                    <span className={styles.modalDetailValue}>{handlePriceFormat(`${pkg.price}`)}</span>
                                </div>
                            )}
                            {membership.start_date && (
                                <div className={styles.modalDetailRow}>
                                    <span className={styles.modalDetailLabel}>Inicio</span>
                                    <span className={styles.modalDetailValue}>
                                        {new Date(membership.start_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                            {pkg?.group_size != null && (
                                <div className={styles.modalDetailRow}>
                                    <span className={styles.modalDetailLabel}>Tipo</span>
                                    <span className={styles.modalDetailValue}>{pkg.group_size > 1 ? 'Familiar' : 'Personal'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

// ── Main Table ────────────────────────────────────────────────────────────────
export default function MembershipTable({ getMembershipColor }: {
    getMembershipColor: (membershipId?: string) => string
}) {
    const { customers } = useCustomerStore()
    const [selected, setSelected] = useState<any | null>(null)

    return (
        <>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Plan</th>
                            <th>Precio</th>
                            <th>Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr
                                key={c.id}
                                className={styles.tableRow}
                                onClick={() => setSelected(c)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setSelected(c)}
                            >
                                <th scope="row" className={styles.nameCell}>
                                    <span className={styles.nameAvatar}>{c.name?.charAt(0).toUpperCase()}</span>
                                    {c.name}
                                </th>
                                <td>
                                    <span className={styles.phoneCell}>
                                        <Phone size={12} strokeWidth={1.8} />
                                        {c.phone}
                                    </span>
                                </td>
                                <td><StatusChip customer={c} /></td>
                                <td className={styles.planCell}>{c.membership_customers?.[0]?.memberships?.packages?.name}</td>
                                <td className={styles.priceCell}>{handlePriceFormat(`${c.membership_customers?.[0]?.memberships?.packages?.price}`)}</td>
                                <td><AttendanceChip customerId={c.id!} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <MemberModal customer={selected} onClose={() => setSelected(null)} />
            )}
        </>
    )
}