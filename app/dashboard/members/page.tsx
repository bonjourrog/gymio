'use client'

import NewSubForm from "@/app/components/newSubForm";
import NewUserForm from "@/app/components/newUserform";
import { Membership } from "@/app/entity/membership";
import { useUser } from "@/app/hooks/useUser";
import { formatPhoneNumber, handlePriceFormat, spanishFormat } from "@/app/lib/formatting";
import { useCustomerStore } from "@/app/store/customerStore"
import dayjs, { Dayjs } from "dayjs";
import { Phone, Plus } from "lucide-react";
import { useState } from "react";

export default function Members() {
    const {customers} = useCustomerStore();
    const {getUsers} = useUser()
    const [showNewUserForm, setShowNewUserForm] =useState<boolean>(false);
    const [showNewSubForm, setShowNewSubForm] =useState<boolean>(false);
    

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

    const membershipStatus = (membership:Membership|undefined)=>{
        let content = {text:'',  styles:''};
        if(!membership){
            content={
                text:'Sin suscripcion', 
                styles:'border border-zinc-400 text-zinc-700'
            }
        }else{
            const expiredSoon = dayjs(membership.end_date).diff(dayjs(), 'day')
            console.log(expiredSoon);
            
            switch(membership.status){
                case 'active':
                    content={text:'Activa', styles:'bg-green-300 text-green-800'}
                    break;
                case 'expired':
                    content={text:'Expirada', styles:'bg-red-400 text-white'}
                    break;
                case 'paused':
                    content={text:'Pausada', styles:'bg-yellow-200 text-zinc-700'}
                    break;
                case 'canceled':
                    content={text:'Cancelada', styles:'bg-gray-200 text-zinc-500'}
                    break;
            }
        }
        
        return <th><span className={`${content.styles} rounded-lg px-4 py-2 font-light`}>{content.text}</span></th>
    }
    
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
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        <th>Suscripcion</th>
                        <th>Fecha inicio</th>
                        <th>Estado</th>
                        <th>Plan</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c=>{
                        return(
                        <tr key={c.id}>
                            <th scope='row'>{c.name}</th>
                            <td className="flex items-center">
                                <Phone size={14} className="inline mr-2 mb-1"/>
                                {c.phone}
                            </td>
                            <td>
                                <span className={`${getMembershipColor(c.membership_customers?.[0]?.memberships?.id)} font-normal rounded-md p-2 text-sm`}>
                                    {
                                        c.membership_customers?.[0]?.memberships?`${c.membership_customers?.[0]?.memberships?.packages?.group_size!>1?
                                        'FAM':'PER'}-${c.membership_customers?.[0]?.memberships?.id?.substring(0,5)||''}`:null
                                    }
                                </span>
                            </td>
                            <th className="font-light">{spanishFormat(dayjs(c?.membership_customers?.[0]?.memberships?.start_date))}</th>
                            {membershipStatus(c.membership_customers?.[0]?.memberships)}
                            <td>{c.membership_customers?.[0]?.memberships?.packages?.name}</td>
                            <th>{handlePriceFormat(`${c.membership_customers?.[0]?.memberships?.packages?.price}`)}</th>
                            {/* <th><span className="bg-zinc-700 text-white rounded-lg px-4 py-2 font-light">Pagar</span></th> */}
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    </section>
}