import { useState } from "react"
import { ApiResponse } from "../types/api";
import { useCheckinStore } from "../store/checkin";
import { useCustomerStore } from "../store/customerStore";
import { getCustomerWithMembership } from "../lib/utils";
import { CustomerCheckin } from "../entity/customerChecikn";
import { Checkin } from "../entity/checkin";

export const useCheckin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const addCheckins = useCheckinStore(s => s.addCheckins);
    const customerCheckIns = useCheckinStore(s => s.customerCheckIns);
    const customers = useCustomerStore(s => s.customers);
    const getAllCheckin = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('api/checkin', { method: "GET", headers: { "Content-Type": "application/json" } })
            console.log(res);

            if (!res.ok) throw new Error(res.statusText);
            const data: ApiResponse = await res.json();
            if (!data.success) throw new Error(data.message)

            const check_ins = new Map((data.data as Checkin[]).map(ci => [ci.customer_id, ci.check_in_date]));
            const filteredCustomers: CustomerCheckin[] = getCustomerWithMembership(customers)
                .map(c => ({
                    customer_name: c.name,
                    package_name: c.membership_customers?.[0]?.memberships?.packages?.name!,
                    checkin: {
                        id: '',
                        check_in_date: check_ins.get(c.id!) || '',
                        customer_id: c.id!
                    }
                }))

            addCheckins(filteredCustomers)
        } catch (error: any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    return {  getAllCheckin, isLoading }
}