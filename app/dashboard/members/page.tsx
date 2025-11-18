'use client'

import NewSubForm from "@/app/components/newSubForm";
import NewUserForm from "@/app/components/newUserform";
import { Customer } from "@/app/entity/customer";
import { Plus } from "lucide-react";
import { useState } from "react"
import MembershipTable from "./components/membersTable";

export default function Members() {
    const customerList = (customers: Customer[]): Record<string, Customer[]> => {
        return customers.reduce((acc, customer) => {
            // Obtén el ID de la membresía
            const membresia = customer.membership_customers?.[0]?.memberships?.id || "Sin membresía";
            if (!acc[membresia]) acc[membresia] = [];
            acc[membresia].push(customer);
            return acc;
        }, {} as Record<string, Customer[]>);
    };
    // console.log(customerList(customers));
    const [showNewUserForm, setShowNewUserForm] = useState<boolean>(false);
    const [showNewSubForm, setShowNewSubForm] = useState<boolean>(false);


    // Mapea cada membership_id a un color fijo
    const colorMap: Record<string, string> = {};
    const colors = [
        'bg-[#e8f1ec] text-[#4a6657]',
        'bg-[#ebe9f5] text-[#5d5477]',
        'bg-[#f8ede9] text-[#7a574a]',
        'bg-[#e9f2f9] text-[#4a5f7a]',
        'bg-[#f5e9ed] text-[#7a4a5f]',
        // 'bg-[#f9f8fc]',
    ];

    // Asigna color por membership_id
    const getMembershipColor = (membershipId?: string) => {
        if (!membershipId) return ''; // sin membresía, fondo normal

        if (!colorMap[membershipId]) {
            const nextColor = colors[Object.keys(colorMap).length % colors.length];
            colorMap[membershipId] = nextColor;
        }

        return colorMap[membershipId];
    };
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
            <button onClick={() => setShowNewUserForm(true)} className="flex items-center gap-2 p-2 px-4 rounded-full text-white bg-zinc-800">
                <Plus size={17} />
                Agregar rapido
            </button>
            <button onClick={() => setShowNewSubForm(true)} className="flex items-center gap-2 p-2 px-4 rounded-full border border-blue-300 text-blue-500 bg-blue-50">
                <Plus size={17} />
                Agregar
            </button>
        </div>
        <MembershipTable getMembershipColor={getMembershipColor}/>
    </section>
}