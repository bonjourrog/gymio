'use client'

import NewSubForm from "@/app/components/newSubForm";
import NewUserForm from "@/app/components/newUserform";
import { Plus } from "lucide-react";
import { useState } from "react"
import MembershipTable from "./components/membersTable";
import MembersList from "./components/membersList";

export default function Members() {
    const [showNewUserForm, setShowNewUserForm] = useState<boolean>(false);
    const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);

    return <section className="p-10 pt-0 h-screen max-w-[calc(100vw-260px)]">
        {
            showNewSubForm?<div className="fixed left-0 top-0 flex items-center justify-center h-screen w-screen bg-zinc-950/20">
                <NewSubForm showForm={setShowNewSubForm}/>
            </div>:undefined
        }
        {
            showNewUserForm?<div className="fixed left-0 top-0 flex items-center justify-center h-screen w-screen bg-zinc-950/20">
                <NewUserForm showForm={setShowNewUserForm}/>
            </div>:undefined
        }
        <div className="flex justify-end gap-2 mb-4">
            {/* <button onClick={() => setShowNewUserForm(true)} className="flex items-center gap-2 p-2 px-4 rounded-full text-white bg-zinc-800">
                <Plus size={17} />
                Agregar rapido
            </button> */}
            <button onClick={() => setShowNewSubForm(true)} className="flex items-center gap-2 p-2 px-6 rounded-full text-white bg-zinc-800 cursor-pointer">
                <Plus size={17} />
                Agregar
            </button>
        </div>
        <MembersList/>
        {/* <MembershipTable getMembershipColor={getMembershipColor}/> */}
    </section>
}