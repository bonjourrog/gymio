'use client'

import NewSubForm from "@/app/components/newSubForm";
import { CalendarCheck2, Plus, Users } from "lucide-react";
import MembersList from "./components/membersList";
import { MembersProvider, useMembersContext } from "./membersContext";
import { useState } from "react";
import MembershipTable from "./components/membersTable";
import { getMembershipColor } from "@/app/lib/utils";

export default function MembersPage() {
    return (
        <MembersProvider>
            <MembersContent />
        </MembersProvider>
    )
}

function MembersContent() {
    const [tab, setTab] = useState<'memberships' | 'clients'>('memberships')
    const { showNewSubForm, closeNewSubForm, opeNewSubForm } = useMembersContext()
    const getColorForTable = (membershipId?: string) => getMembershipColor({}, membershipId)

    return (
        <section className="flex flex-col h-full px-8 pt-6 pb-0 overflow-hidden">

            {/* New subscription form overlay */}
            {showNewSubForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                    <NewSubForm onClose={closeNewSubForm} />
                </div>
            )}

            {/* ── Top bar ── */}
            <div className="flex items-center justify-between gap-4 mb-5 flex-shrink-0 flex-wrap">

                {/* Pill tabs */}
                <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-[10px] p-1">
                    <button
                        onClick={() => setTab('memberships')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[7px] text-sm font-medium transition-all cursor-pointer
                            ${tab === 'memberships'
                                ? 'bg-white text-zinc-900 font-semibold shadow-sm ring-1 ring-black/[0.06]'
                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/60'
                            }`}
                    >
                        <CalendarCheck2 size={14} strokeWidth={tab === 'memberships' ? 2.2 : 1.8} />
                        Membresías
                    </button>
                    <button
                        onClick={() => setTab('clients')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[7px] text-sm font-medium transition-all cursor-pointer
                            ${tab === 'clients'
                                ? 'bg-white text-zinc-900 font-semibold shadow-sm ring-1 ring-black/[0.06]'
                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-white/60'
                            }`}
                    >
                        <Users size={14} strokeWidth={tab === 'clients' ? 2.2 : 1.8} />
                        Clientes
                    </button>
                </div>

                {/* Add button */}
                <button
                    onClick={opeNewSubForm}
                    className="flex items-center gap-2 px-4 py-2 rounded-[9px] bg-zinc-900 text-white text-sm font-semibold
                            shadow-sm hover:bg-zinc-800 hover:-translate-y-px active:translate-y-0
                            transition-all cursor-pointer whitespace-nowrap"
                >
                    <Plus size={14} strokeWidth={2.5} />
                    Agregar
                </button>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 min-h-0 overflow-y-auto pb-6">
                {tab === 'memberships'
                    ? <MembersList />
                    : <MembershipTable getMembershipColor={getColorForTable} />
                }
            </div>

        </section>
    )
}