'use client'

import NewSubForm from "@/app/components/newSubForm";
import NewUserForm from "@/app/components/newUserform";
import { useUser } from "@/app/hooks/useUser";
import { useCustomerStore } from "@/app/store/customerStore"
import { ApiResponse } from "@/app/types/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Members() {
    const {customers} = useCustomerStore();
    const {getUsers} = useUser()
    const [showNewUserForm, setShowNewUserForm] =useState<boolean>(false);
    const [showNewSubForm, setShowNewSubForm] =useState<boolean>(false);
    
    useEffect(()=>{
        getUsers();
    },[])
    return <section className="p-10 pt-0">
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
        <div className="table">
            <table>
                <thead className='rounded-2xl'>
                    <tr>
                        <th>Nombre</th>
                        <th>Telefono</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c=>(
                        <tr key={c.id}>
                            <th scope='row'>{c.name}</th>
                            <td>{c.phone}</td>
                            <th><span className="bg-orange-500 text-white rounded-lg px-4 py-2 font-light">Por vencer</span></th>
                            <th><span className="bg-zinc-700 text-white rounded-lg px-4 py-2 font-light">Pagar</span></th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
}