'use client'

import { handlePriceFormat } from "@/app/lib/formatting"
import {
    Phone, X, Calendar, DollarSign, User,
    CheckCircle2, XCircle, Clock, AlertTriangle, Ban,
    Search, ChevronLeft, ChevronRight, UserCheck
} from "lucide-react"
import { useCustomerStore } from "@/app/store/customerStore"
import { useMemo, useState } from "react"
import styles from "./membersTable.module.css"
import { useCheckinActions } from "@/app/hooks/useCheckinActions"

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// ─────────────────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────────────────
function getCurrentWeekDays(): Date[] {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return d
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Status chip
// ─────────────────────────────────────────────────────────────────────────────
function getStatusConfig(customer: any) {
    const membership = customer.membership_customers?.[0]?.memberships
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
            {icon}{label}
        </span>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Attendance chip — real data from store
// ─────────────────────────────────────────────────────────────────────────────
function AttendanceChip({ customerId }: { customerId: string }) {
    const { isCheckedIn } = useCheckinActions()
    const checked = isCheckedIn(customerId)
    return (
        <span className={`${styles.attendanceChip} ${checked ? styles.chipPresent : styles.chipAbsent}`}>
            {checked
                ? <><CheckCircle2 size={12} strokeWidth={2} /> Hoy</>
                : <><Clock size={12} strokeWidth={2} /> Sin check-in</>
            }
        </span>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Weekly heatmap — real data, only today is known until API supports history
// ─────────────────────────────────────────────────────────────────────────────
function WeeklyHeatmap({ customerId }: { customerId: string }) {
    const { getCheckinByCustomerId } = useCheckinActions()
    const record = getCheckinByCustomerId(customerId)
    const week = getCurrentWeekDays()
    const todayDate = new Date().toDateString()

    const checkedTodayDate = record?.checkin?.check_in_date
        ? new Date(record.checkin.check_in_date).toDateString()
        : null

    return (
        <div className={styles.heatmap}>
            <div className={styles.heatmapGrid}>
                {week.map((day, i) => {
                    const isToday = day.toDateString() === todayDate
                    const isFuture = day > new Date() && !isToday
                    const present = isToday && checkedTodayDate === todayDate
                    return (
                        <div key={i} className={styles.heatmapCell}>
                            <span className={styles.heatmapDayLabel}>{DAY_LABELS[i]}</span>
                            <div
                                className={[
                                    styles.heatmapBlock,
                                    present              ? styles.blockPresent : '',
                                    isToday && !present  ? styles.blockToday   : '',
                                    isFuture             ? styles.blockFuture  : '',
                                    !present && !isFuture && !isToday ? styles.blockAbsent : '',
                                ].filter(Boolean).join(' ')}
                                title={`${DAY_LABELS[i]} ${day.getDate()}/${day.getMonth() + 1} — ${
                                    present ? 'Asistió' : isFuture ? 'Próximo' : isToday ? 'Aún no' : 'Sin datos'
                                }`}
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

// iOS Safari fix: onClick on fixed divs doesn't fire without cursor:pointer.
// Also handle onTouchEnd to make overlay-close reliable on touch devices.
function overlayClose(onClose: () => void) {
    return {
        onClick:    (e: React.MouseEvent)    => { if (e.target === e.currentTarget) onClose() },
        onTouchEnd: (e: React.TouchEvent)    => { if (e.target === e.currentTarget) onClose() },
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check-in modal
// ─────────────────────────────────────────────────────────────────────────────
function CheckinModal({ customer, onClose }: { customer: any; onClose: () => void }) {
    const { getCheckinByCustomerId, toggleCheckin, isCheckedIn, getCheckinTime } = useCheckinActions()
    const record = getCheckinByCustomerId(customer.id)
    const checked = isCheckedIn(customer.id)
    const checkinTime = getCheckinTime(customer.id)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        if (!record) return
        setLoading(true)
        await toggleCheckin(record.checkin)
        setLoading(false)
    }

    return (
        <div className={styles.modalOverlay} {...overlayClose(onClose)}>
            <div className={`${styles.modal} ${styles.checkinModalSize}`} role="dialog" aria-modal="true">

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalAvatar}>{customer.name?.charAt(0).toUpperCase()}</div>
                    <div className={styles.modalUserInfo}>
                        <h2 className={styles.modalName}>{customer.name}</h2>
                        <span className={styles.modalPhone}><Phone size={11} strokeWidth={1.8} />{customer.phone}</span>
                    </div>
                    <StatusChip customer={customer} size="md" />
                    <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
                        <X size={15} strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.checkinBody}>
                    {/* Status card */}
                    <div className={`${styles.checkinStatus} ${checked ? styles.checkinStatusPresent : styles.checkinStatusAbsent}`}>
                        <span className={styles.checkinStatusIcon}>
                            {checked ? <CheckCircle2 size={30} strokeWidth={1.6} /> : <Clock size={30} strokeWidth={1.6} />}
                        </span>
                        <div>
                            <p className={styles.checkinStatusLabel}>
                                {checked ? 'Check-in registrado' : 'Sin check-in hoy'}
                            </p>
                            {checkinTime && <p className={styles.checkinStatusTime}>{checkinTime}</p>}
                        </div>
                    </div>

                    {/* Toggle button */}
                    <button
                        className={`${styles.checkinToggleBtn} ${checked ? styles.checkinToggleRemove : styles.checkinToggleAdd}`}
                        onClick={handleToggle}
                        disabled={loading || !record}
                    >
                        {loading ? (
                            <span className={styles.checkinSpinner} />
                        ) : checked ? (
                            <><XCircle size={15} strokeWidth={2} /> Quitar check-in</>
                        ) : (
                            <><CheckCircle2 size={15} strokeWidth={2} /> Registrar check-in</>
                        )}
                    </button>

                    {!record && (
                        <p className={styles.checkinHint}>
                            Carga la lista de asistencia desde el Dashboard para activar el check-in.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Member detail modal
// ─────────────────────────────────────────────────────────────────────────────
function MemberModal({ customer, onClose }: { customer: any; onClose: () => void }) {
    const { isCheckedIn } = useCheckinActions()
    const membership = customer.membership_customers?.[0]?.memberships
    const pkg = membership?.packages
    const checked = isCheckedIn(customer.id)
    const daysThisWeek = checked ? 1 : 0

    return (
        <div className={styles.modalOverlay} {...overlayClose(onClose)}>
            <div className={styles.modal} role="dialog" aria-modal="true">

                <div className={styles.modalHeader}>
                    <div className={styles.modalAvatar}>{customer.name?.charAt(0).toUpperCase()}</div>
                    <div className={styles.modalUserInfo}>
                        <h2 className={styles.modalName}>{customer.name}</h2>
                        <span className={styles.modalPhone}><Phone size={11} strokeWidth={1.8} />{customer.phone}</span>
                    </div>
                    <StatusChip customer={customer} size="md" />
                    <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
                        <X size={15} strokeWidth={2} />
                    </button>
                </div>

                <div className={styles.modalStats}>
                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color="blue"><Calendar size={13} /></span>
                        <div>
                            <p className={styles.modalStatValue}>{daysThisWeek} / 7</p>
                            <p className={styles.modalStatLabel}>Esta semana</p>
                        </div>
                    </div>
                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color={checked ? 'green' : 'red'}>
                            {checked ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        </span>
                        <div>
                            <p className={styles.modalStatValue}>{checked ? 'Presente' : 'Ausente'}</p>
                            <p className={styles.modalStatLabel}>Hoy</p>
                        </div>
                    </div>
                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color="amber"><DollarSign size={13} /></span>
                        <div>
                            <p className={styles.modalStatValue}>{handlePriceFormat(`${pkg?.price}`)}</p>
                            <p className={styles.modalStatLabel}>Precio plan</p>
                        </div>
                    </div>
                    <div className={styles.modalStat}>
                        <span className={styles.modalStatIcon} data-color="purple"><User size={13} /></span>
                        <div>
                            <p className={styles.modalStatValue}>{pkg?.name ?? '—'}</p>
                            <p className={styles.modalStatLabel}>Plan</p>
                        </div>
                    </div>
                </div>

                <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>Asistencia semanal</h3>
                    <WeeklyHeatmap customerId={customer.id} />
                </div>

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

// ─────────────────────────────────────────────────────────────────────────────
// Main table
// ─────────────────────────────────────────────────────────────────────────────
export default function MembershipTable({ getMembershipColor }: {
    getMembershipColor: (membershipId?: string) => string
}) {
    const { customers } = useCustomerStore()
    const [search, setSearch]           = useState('')
    const [page, setPage]               = useState(1)
    const [detailCustomer, setDetail]   = useState<any | null>(null)
    const [checkinCustomer, setCheckin] = useState<any | null>(null)

    const filtered = useMemo(() =>
        customers.filter(c =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.phone?.includes(search)
        ),
        [customers, search]
    )

    const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const handleSearch = (val: string) => { setSearch(val); setPage(1) }

    return (
        <>
            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                    <Search size={14} strokeWidth={2} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Buscar por nombre o teléfono…"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {search && (
                        <button className={styles.searchClear} onClick={() => handleSearch('')} aria-label="Limpiar búsqueda">
                            <X size={12} strokeWidth={2.5} />
                        </button>
                    )}
                </div>
                <span className={styles.countLabel}>{filtered.length} miembro{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* ── Table ── */}
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.emptyRow}>
                                    No se encontraron miembros
                                </td>
                            </tr>
                        ) : paginated.map(c => (
                            // No onClick on <tr> — iOS Safari fires click on <tr> unpredictably.
                            // All interactivity is handled by native <button> elements inside cells.
                            <tr key={c.id} className={styles.tableRow}>
                                <th scope="row">
                                    {/* Real <button> covers the name cell — safe for iOS Safari */}
                                    <button
                                        className={styles.nameCell}
                                        onClick={() => setDetail(c)}
                                        aria-label={`Ver detalles de ${c.name}`}
                                    >
                                        <span className={styles.nameAvatar}>{c.name?.charAt(0).toUpperCase()}</span>
                                        {c.name}
                                    </button>
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
                                <td>
                                    <button
                                        className={styles.checkinRowBtn}
                                        onClick={() => setCheckin(c)}
                                        title="Registrar check-in"
                                        aria-label={`Check-in para ${c.name}`}
                                    >
                                        <UserCheck size={14} strokeWidth={2} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft size={14} strokeWidth={2.5} />
                    </button>

                    <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                className={`${styles.pageNumber} ${n === currentPage ? styles.pageNumberActive : ''}`}
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <button
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Página siguiente"
                    >
                        <ChevronRight size={14} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {/* ── Modals ── */}
            {detailCustomer  && <MemberModal   customer={detailCustomer}  onClose={() => setDetail(null)}  />}
            {checkinCustomer && <CheckinModal  customer={checkinCustomer} onClose={() => setCheckin(null)} />}
        </>
    )
}