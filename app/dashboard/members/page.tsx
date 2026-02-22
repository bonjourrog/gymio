'use client'

import NewSubForm from "@/app/components/newSubForm";
import { CalendarCheck2, IdCard, Plus, Users } from "lucide-react";
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
    const [tab, setTab] = useState<'memberships' | 'clients'>('memberships');
    // const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);
    const { showNewSubForm, closeNewSubForm, opeNewSubForm } = useMembersContext()
    // wrap util to match MembershipTable signature: (membershipId?: string) => string
    const getColorForTable = (membershipId?: string) => getMembershipColor({}, membershipId)

    return <section className="p-10 pt-0 h-screen max-w-[calc(100vw-260px)]">
        {
            showNewSubForm ? <div className="fixed left-0 top-0 flex items-center justify-center h-screen w-screen bg-zinc-950/20 z-10">
                <NewSubForm onClose={closeNewSubForm} />
            </div> : undefined
        }
        {/* {
            showNewUserForm?<div className="fixed left-0 top-0 flex items-center justify-center h-screen w-screen bg-zinc-950/20">
                <NewUserForm showForm={setShowNewUserForm}/>
            </div>:undefined
        } */}
        <div className="flex justify-end gap-2 mb-4">
            {/* <button onClick={() => setShowNewUserForm(true)} className="flex items-center gap-2 p-2 px-4 rounded-full text-white bg-zinc-800">
                <Plus size={17} />
                Agregar rapido
            </button> */}
            <button onClick={opeNewSubForm} className="flex items-center gap-2 p-2 px-6 rounded-full text-white bg-zinc-800 cursor-pointer">
                <Plus size={17} />
                Agregar
            </button>
        </div>
        <section className="overflow-scroll h-[calc(100%-64px)]">
            <header className="flex gap-2 w-fit border-b-2 border-zinc-800">
                <button className={`p-2 rounded-t-md transition-colors cursor-pointer flex items-center gap-2 ${tab === 'memberships' ? 'text-white bg-zinc-800' : 'text-zinc-400'}`} onClick={() => setTab('memberships')}>
                    <CalendarCheck2 size={15}/>
                    Membresias
                </button>
                <button className={`p-2 rounded-t-md transition-colors cursor-pointer flex items-center gap-2 ${tab === 'clients' ? 'text-white bg-zinc-800' : 'text-zinc-400'}`} onClick={() => setTab('clients')}>
                    <Users size={15} />
                    {/* <IdCard size={15}/> */}
                    Clientes
                </button>
            </header>
            {
                tab === 'memberships' ? <MembersList /> : <MembershipTable getMembershipColor={getColorForTable}/>
            }
        </section>
        {/* <MembershipTable getMembershipColor={getMembershipColor}/> */}
    </section>
}