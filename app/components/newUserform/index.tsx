import { Customer } from "@/app/entity/customer";
import { useUser } from "@/app/hooks/useUser"
import { formatPhoneNumber } from "@/app/lib/formatting";
import { User2 } from "lucide-react";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { toast } from "sonner";

export default function NewUserForm({ showForm }: { showForm?: Dispatch<SetStateAction<boolean>> }) {
    const { registerUser } = useUser();
    const [phone, setPhone] = useState<string>('');
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const name = (formData.get('name') as string)?.trim()||'';
            const phone = (formData.get('phone') as string)?.trim()||'';
            if (!name || name === "" || !phone || phone === "") {
                toast.warning('Todos los campos son obligatorios')
                return
            }
            if(phone.replace(/\s/g,'').length<10){
                toast.warning("ingrese un numero valido")
                return
            }
            if(name.split(' ').length <2){
                toast.warning("ingrese el nombre completo")
                return
            }
            const newCustomer: Customer = {
                name: name,
                phone: phone
            }
            const res = await registerUser([newCustomer]);
            if(res.error){
                toast.error(res.message)
                return
            }
            
            showForm?.(false)
        } catch (error) {
                console.log(error);
                
        }
    }
    const formatPhone = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value.length > 12) return
        const formattedPhone = formatPhoneNumber(event.currentTarget.value);
        setPhone(formattedPhone);

    }
    return <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-10 min-w-[25em] rounded-lg bg-white ">
        <h2 className="flex gap-2 items-center mb-6 font-bold text-3xl">
            <User2 strokeWidth={3}/>
            Agregar cliente
        </h2>
        <label htmlFor="name">
            Nombre completo
            <input type="text" name="name" id="name" />
        </label>

        <label htmlFor="telefono">
            Telefono
            <input type="tel" value={phone} onChange={formatPhone} name="phone" id="phone" />
        </label>

        <div className="flex w-full justify-between gap-2">
            <button className="w-full cursor-pointer" onClick={(e) => {
                e.preventDefault();
                showForm?.(false);
            }}>Cancelar</button>
            <button className="bg-zinc-800 p-3 text-white rounded-lg w-full cursor-pointer">Agregar</button>
        </div>
    </form>
}