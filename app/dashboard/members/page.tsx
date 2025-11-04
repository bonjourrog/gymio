'use client'

import NewUserForm from "@/app/components/newUserForm";
import { useCustomerStore } from "@/app/store/customerStore"
import { ApiResponse } from "@/app/types/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Members() {
    const {customers, setCustomers} = useCustomerStore();
    const [showNewUserForm, setShowNewUserForm] =useState<boolean>(false);
    const handleCustomersRetrieve = async()=>{
        try {
            const res = await fetch('/api/customer',{
            method:'GET'
        })
        const data:ApiResponse = await res.json();
        if(!data.success){
            throw new Error(data.message)
        }
        setCustomers(data.data);
        } catch (error:any) {
            console.log(error.message);
        }
        
    }
    useEffect(()=>{
        handleCustomersRetrieve()
    },[])
    return <section className="p-10 pt-0">
        {
            showNewUserForm?<div className="fixed left-0 top-0 flex items-center justify-center h-screen w-screen bg-zinc-950/20">
                <NewUserForm showForm={setShowNewUserForm}/>
            </div>:undefined
        }
        <div className="flex justify-end mb-4">
            <button onClick={()=>setShowNewUserForm(true)} className="flex items-center gap-2 p-2 px-4 rounded-full border border-blue-300 text-blue-500 bg-blue-50">
            <Plus size={17}/>
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
                        <tr>
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