import { useCheckin } from "@/app/hooks/useCheckin";
import { useCheckinStore } from "@/app/store/checkin";
import {  LucideCheckCircle2, Search } from "lucide-react";
import { CSSProperties, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Checkin() {
    const customerCheckIns = useCheckinStore(s => s.customerCheckIns);
    const {checkInCustomer}=useCheckin()
    const [input, setInput] = useState<string>('');
    const filteredCustomers = useMemo(() => {
        return customerCheckIns.filter(c => c.customer_name.toLowerCase().includes(input.toLowerCase()))
    }, [customerCheckIns, input])
    const checkedStyle:CSSProperties = {
        border:'.1em solid #a7efa8',
        backgroundColor:'#f0fdf1'
    }
    const handleCheckin = async (customer_id:string)=>{
        try {
            await checkInCustomer(customer_id)
            toast.success("Asistencia tomada esxitosamente")
        } catch (error) {
            toast.error("Error al tomar asistencia")
        }
    }
    return <section className="flex flex-col gap-4 p-10 max-w-[35em] rounded-2xl bg-linear-to-t from-white via-white  to-green-100">
        <header>
            <h1 className="text-2xl font-black">Asistencia</h1>
            <p>Bienvenido, escribe el nombre de un clietne para buscar.</p>
        </header>
        <hr className="text-zinc-200" />
        <form>
            <label htmlFor="searchbox">
                {/* Nombre del cliente */}
                <div className="flex items-center px-4 w-full border-2 border-zinc-200 bg-zinc-50 rounded-xl">
                    <Search className="text-zinc-400" strokeWidth={3} />
                    <input placeholder="Ingresa el nombre del cliente" id="searchbox" style={{ border: 'none', outline: 'none' }} type="text" value={input} onChange={({ target: { value } }) => setInput(value)} />
                </div>
            </label>
        </form>
        <ul className="flex flex-col gap-2 max-h-60 overflow-y-scroll">
            {input && filteredCustomers.map(customer => (
                <li
                    onClick={()=>handleCheckin(customer.checkin.customer_id)}
                    style={customer.checkin.check_in_date ? checkedStyle : undefined}
                    key={`${customer.checkin.customer_id}`}
                    className="relative flex gap-2 p-4 rounded-xl bg-zinc-50 cursor-pointer hover:bg-zinc-100 hover:ml-1 hover:border border-zinc-200 transition-all duration-100">
                    <span className="flex items-center justify-center w-12 h-12 p-2 rounded-md bg-zinc-800 text-white font-black">
                        {customer.customer_name[0].toUpperCase()}{customer.customer_name.split(" ")[1][0].toLocaleUpperCase()}
                    </span>
                    <div className="flex flex-col gap-0">
                        <p className="font-semibold">{customer.customer_name}</p>
                        {customer.checkin.check_in_date ?
                            <small className="absolute top-2 right-2 flex gap-2 items-center text-green-600">
                                <LucideCheckCircle2 className="text-green-600"/>
                                {new Date(customer.checkin.check_in_date).toLocaleTimeString("es-MX", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                                })}
                            </small>
                            : null}
                        <small className="w-fit px-2 font-semibold bg-zinc-200 rounded-md">{customer.package_name}</small>
                    </div>
                </li>
            ))}
        </ul>
    </section>
}