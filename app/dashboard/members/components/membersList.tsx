import styles from '../styles.module.css';
import { Customer } from "@/app/entity/customer";
import { useCustomerStore } from "@/app/store/customerStore";
import { Phone, User2 } from 'lucide-react';
import MembershipStatus from './membershipStatusButton';
import { handlePriceFormat, spanishFormat } from '@/app/lib/formatting';
import dayjs from 'dayjs';
import { useMemo } from 'react';
export default function MembersList() {
    const { customers } = useCustomerStore();
    // Agrupar clientes por ID de membresía
    const customerList = useMemo(() => {
        const allowedStatuses = ['active', 'expired'];
        return customers.filter(c=>allowedStatuses.includes(c.membership_customers?.[0]?.memberships?.status as string)).reduce((acc, customer) => {
            // Obtén el ID de la membresía
            const membresia = customer.membership_customers?.[0]?.memberships?.id || "Sin membresía";
            if (!acc[membresia]) acc[membresia] = [];
            acc[membresia].push(customer);
            return acc;
        }, {} as Record<string, Customer[]>);

    }, [customers])

    return <section className={styles['table-wrapper']}>
        {Object.entries(customerList).map(([membershipId, members]) => (
            <div key={membershipId}>
                <table className='w-full table-auto border-collapse bg-gray-100 border-l-4 border-emerald-500'>
                    <thead>
                        <tr className="text-left">
                            <th>Plan</th>
                            <th>Precio</th>
                            <th>Inicio</th>
                            <th>Status</th>
                            <th>Días restantes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-left">
                            <td>{members[0].membership_customers?.[0]?.memberships?.packages?.name || membershipId}</td>
                            <td>{handlePriceFormat(`${members[0].membership_customers?.[0]?.memberships?.packages?.price}`)}</td>
                            <td>{spanishFormat(dayjs(members[0].membership_customers?.[0]?.memberships?.start_date))}</td>
                            <td style={{ padding: '1em' }}>{
                                membershipId === "Sin membresía" ? 
                                <p className='border w-fit px-2 py-1 font-medium rounded-lg'>{membershipId}</p> 
                                :<MembershipStatus key={membershipId} membership={members[0].membership_customers?.[0]?.memberships} />
                            }</td>
                            <td className='flex items-center gap-2'>{dayjs(members[0].membership_customers?.[0]?.memberships?.end_date).diff(dayjs(), 'day')}</td>
                        </tr>
                    </tbody>
                </table>
                <ul className="list-inside pl-10">
                    {members.map(member => (
                        <li key={member.id} className="flex items-center gap-10 border-b border-zinc-100 py-2">
                            <p className='flex items-center gap-2 min-w-40 italic'>
                                <User2 size={13} />
                                {member.name}
                            </p>
                            <p className='flex items-center gap-2'>
                                <Phone size={13} />
                                {member.phone}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </section>;
}