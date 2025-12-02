'use client'

import { ChangeEvent, FormEvent, useState } from "react"
import { createProfile } from "../../action"
import { ApiResponse } from "@/app/types/api"
import { toast } from "sonner"
import { formatPhoneNumber } from "@/app/lib/formatting"

export default function OnBoardingForm() {
    const [phone, setPhone] = useState<string>('');
    const handleSubmit = async (event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        try {
            const form = event.currentTarget
            const formData = new FormData(form)

            const gym_name = formData.get("gym_name")?.toString().trim() || ""
            const full_name = formData.get("full_name")?.toString().trim() || ""
            const phoneValue = formData.get("phone")?.toString().trim() || ""
            if(gym_name === '' || full_name === '' || phoneValue ===''){
                toast.info('verifique la informacion')
                return
            }
            await createProfile(formData)
        } catch (error) {
            console.log(error);
            
        }

    }
    const handlePhoneOnChange = (event:ChangeEvent<HTMLInputElement>)=>{
        const value = event.currentTarget.value;
        if(value.length>12)return;
        const valueFormatted:string = formatPhoneNumber(value);
        setPhone(valueFormatted)
    }
    return <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[30em] p-10 border border-zinc-200 rounded-xl">
        <div className="text-zinc-700 mb-5">
            <h2 className="text-3xl font-black">Bienvenido</h2>
            <p>Termina el registro para poder ingresar</p>
        </div>
        <label htmlFor="gym_name">
            <input type="text" placeholder="Nombre del gimnasio" name="gym_name" id="gym_name" />
        </label>
        <label htmlFor="full_name">
            <input type="text" placeholder="nombre completo" name="full_name" id="full_name" />
        </label>
        <label htmlFor="phone">
            <input value={phone} onChange={handlePhoneOnChange} type="tel" placeholder="Telefono" name="phone" id="phone" />
        </label>
        <button
            className="p-3 rounded-lg cursor-pointer text-white bg-zinc-800 hover:bg-zinc-950"
        >Continuar</button>
    </form>
}