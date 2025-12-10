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

            const check_ins= new Map((data.data as Checkin[]).map(ci => [ci.customer_id, [ci.check_in_date, ci.id]]));
            const filteredCustomers: CustomerCheckin[] = getCustomerWithMembership(customers)
                .map(c => ({
                    customer_name: c.name,
                    package_name: c.membership_customers?.[0]?.memberships?.packages?.name!,
                    checkin: {
                        id: check_ins.get(c.id!)?.[1] || '',
                        check_in_date: check_ins.get(c.id!)?.[0] || '',
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

    const checkInCustomer = async (customer_id: string) => {
        const now = new Date();
        const timestamptzValue = now.toISOString();
        const checkIn: Checkin = {
            id: undefined!,
            check_in_date: timestamptzValue,
            customer_id
        }
        const res = await fetch('api/checkin',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkIn)
            }
        )
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        const data: ApiResponse = await res.json();
        if (!data.success) {
            throw new Error(data.message)
        }
        const newCheckIn: Checkin = data.data[0];
        const newCustomerCheckIns: CustomerCheckin[] = customerCheckIns.map(el => el.checkin.customer_id === newCheckIn.customer_id ?
            { ...el, checkin: { ...newCheckIn } }
            : el)
        addCheckins(newCustomerCheckIns)
    }
    return { checkInCustomer, getAllCheckin, isLoading }
}