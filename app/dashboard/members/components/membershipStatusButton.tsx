import { Membership } from "@/app/entity/membership";
import dayjs from "dayjs";

export default function membershipStatus(membership: Membership | undefined) {
    let content = { text: '', styles: '' };
    if (!membership) {
        content = {
            text: 'Sin suscripcion',
            styles: 'border border-zinc-400 text-zinc-700'
        }
    } else {
        const expiredSoon = dayjs(membership.end_date).diff(dayjs(), 'day')
        console.log(expiredSoon);

        switch (membership.status) {
            case 'active':
                content = { text: 'Activa', styles: 'bg-green-300 text-green-800' }
                break;
            case 'expired':
                content = { text: 'Expirada', styles: 'bg-red-400 text-white' }
                break;
            case 'paused':
                content = { text: 'Pausada', styles: 'bg-yellow-200 text-zinc-700' }
                break;
            case 'canceled':
                content = { text: 'Cancelada', styles: 'bg-gray-200 text-zinc-500' }
                break;
        }
        return <th><span className={`${content.styles} rounded-lg px-4 py-2 font-light`}>{content.text}</span></th>
    }
}