import { status } from "@/app/data/membership";
import type { MembershipStatus } from "@/app/data/membership";
import { Membership } from "@/app/entity/membership";
import { useMembership } from "@/app/hooks/useMembership";
import { memo, useState } from "react";
import styles from "../styles.module.css";
import { toast } from "sonner";

function MembershipStatus({ membership }: { membership?: Membership | undefined }) {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const { updateMembership, loading } = useMembership();

    const translateStatus = (status: string) => {
        let content = { text: '', styles: '' };
        if (!status) {
            content = {
                text: 'Sin suscripcion',
                styles: 'border border-zinc-400 text-zinc-700'
            }
        } else {
            switch (status) {
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
        }
        return content;
    }
    const updateStatus = async (status: MembershipStatus) => {
        if (membership?.status === undefined) return;
        try {
            const res = await updateMembership({
                id: membership!.id!,
                status: status
            });
            if (res?.error) throw new Error(res.message);
            toast.success('Estado de membresía actualizado');
            setShowMenu(false);
        } catch (error: any) {
            toast.error(`Error al actualizar el estado: ${error.message}`);
        }
    }
    return <>
        {showMenu && <div onClick={() => setShowMenu(false)} className={`fixed w-screen h-screen top-0 left-0 ${loading ? 'z-20' : 'z-10'} ${styles.noise}`}>
        </div>}
        {loading && <div className={styles["sk-chase"]}>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
        </div>}
        <span onClick={() => setShowMenu(true)} className={`${translateStatus(membership?.status!).styles} relative rounded-lg px-4 py-2 font-light cursor-pointer`}>
            {
                showMenu && <div className="absolute left-0 -top-6 flex flex-col gap-2 min-w-20 min-h-20 bg-white rounded-xl p-4 z-20 text-zinc-700">
                    {status.filter(s => s !== membership?.status).map((s) => (
                        <span onClick={() => updateStatus(s)} key={s} className={`py-2 px-6 rounded-md text-sm font-bold ${translateStatus(s).styles}`}>{translateStatus(s).text}</span>
                    ))}
                </div>
            }
            {translateStatus(membership?.status!).text}
        </span>
    </>
}
export default memo(MembershipStatus)