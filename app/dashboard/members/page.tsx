'use client'

import { useCustomerStore } from "@/app/store/customerStore"
import { ApiResponse } from "@/app/types/api";
import { useEffect } from "react";

export default function Members() {
    const {customers, setCustomers} = useCustomerStore();
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
    return <section className="p-10">
        <div className="table">
            <table>
                <thead className='rounded-2xl'>
                    <tr>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        {/* <th>Membresia</th> */}
                        {/* <th>Vencimiento</th>
                        <th>Estado</th>
                        <th>Acción</th> */}
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