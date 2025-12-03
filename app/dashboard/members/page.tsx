'use client'

import NewSubForm from "@/app/components/newSubForm";
import { Plus } from "lucide-react";
import { useState } from "react"
import MembersList from "./components/membersList";
import { MembersProvider, useMembersContext } from "./membersContext";
export default function MembersPage() {
    return (
        <MembersProvider>
            <MembersContent />
        </MembersProvider>
    )
}
function MembersContent() {
    // const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);
    const {showNewSubForm, opeNewSubForm} = useMembersContext()

    return <section className="p-10 pt-0 h-screen max-w-[calc(100vw-260px)]">
        {
            showNewSubForm ? <div className="fixed left-0 top-0 flex items-center justify-center h-screen w-screen bg-zinc-950/20 z-10">
                <NewSubForm />
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
        <MembersList />
        {/* <MembershipTable getMembershipColor={getMembershipColor}/> */}
    </section>
}