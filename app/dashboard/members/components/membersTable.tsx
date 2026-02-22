import { Customer } from "@/app/entity/customer"
import { handlePriceFormat, spanishFormat } from "@/app/lib/formatting"
import { Phone } from "lucide-react"
import MembershipStatus from "./membershipStatusButton"
import dayjs from "dayjs"
import { useCustomerStore } from "@/app/store/customerStore"

export default function MembershipTable({ getMembershipColor}:{
    getMembershipColor: (membershipId?: string)=>string
}) {
    const { customers } = useCustomerStore();
    return <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        {/* <th>Suscripcion</th>
                        <th>Fecha inicio</th> */}
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
                            {/* <td>
                                <span className={`${getMembershipColor(c.membership_customers?.[0]?.memberships?.id)} font-normal rounded-md p-2 text-sm`}>
                                    {
                                        c.membership_customers?.[0]?.memberships?`${c.membership_customers?.[0]?.memberships?.packages?.group_size!>1?
                                        'FAM':'PER'}-${c.membership_customers?.[0]?.memberships?.id?.substring(0,5)||''}`:null
                                    }
                                </span>
                            </td> */}
                            {/* <th className="font-light">{spanishFormat(dayjs(c?.membership_customers?.[0]?.memberships?.start_date))}</th> */}
                            <td><MembershipStatus chip={true} customer={[c]} /></td>
                            <td>{c.membership_customers?.[0]?.memberships?.packages?.name}</td>
                            <th>{handlePriceFormat(`${c.membership_customers?.[0]?.memberships?.packages?.price}`)}</th>
                            {/* <th><span className="bg-zinc-700 text-white rounded-lg px-4 py-2 font-light">Pagar</span></th> */}
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
}