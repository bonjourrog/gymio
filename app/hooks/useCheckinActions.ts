import { useCheckin } from "@/app/hooks/useCheckin"
import { useCheckinStore } from "@/app/store/checkin"
import { Checkin } from "@/app/entity/checkin"
import { CustomerCheckin } from "@/app/entity/customerChecikn"
import { toast } from "sonner"

/**
 * useCheckinActions
 * 
 * Shared hook that encapsulates checkin toggle logic and store lookups.
 * Used by both CheckinModal (index.tsx) and MembershipTable.
 */
export function useCheckinActions() {
    const { checkInCustomer, removeCheckIn, getAllCheckin } = useCheckin()
    const customerCheckIns = useCheckinStore(s => s.customerCheckIns)

    /**
     * Toggle check-in for a given Checkin object.
     * If the checkin has an id it means it's already checked in → remove it.
     * Otherwise → create a new check-in.
     */
    const toggleCheckin = async (checkin: Checkin) => {
        try {
            if (!checkin.id) {
                await checkInCustomer(checkin.customer_id)
            } else {
                await removeCheckIn(checkin.id)
            }
            toast.success("Asistencia actualizada exitosamente")
        } catch (error) {
            toast.error("Error al actualizar asistencia")
        }
    }

    /**
     * Given a customer_id, returns its CustomerCheckin record from the store.
     * Returns undefined if checkin data hasn't been loaded yet.
     */
    const getCheckinByCustomerId = (customer_id: string): CustomerCheckin | undefined => {
        return customerCheckIns.find(c => c.checkin.customer_id === customer_id)
    }

    /**
     * Returns true if the customer has checked in today.
     */
    const isCheckedIn = (customer_id: string): boolean => {
        const record = getCheckinByCustomerId(customer_id)
        return Boolean(record?.checkin?.check_in_date)
    }

    /**
     * Returns the formatted check-in time for a customer, or null.
     */
    const getCheckinTime = (customer_id: string): string | null => {
        const record = getCheckinByCustomerId(customer_id)
        if (!record?.checkin?.check_in_date) return null
        return new Date(record.checkin.check_in_date).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
    }

    return {
        toggleCheckin,
        getCheckinByCustomerId,
        isCheckedIn,
        getCheckinTime,
        getAllCheckin,
        customerCheckIns,
    }
}