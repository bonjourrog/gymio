import { useState } from "react"
import { ApiResponse } from "../types/api";
import { MembershipPayload } from "../entity/membershipPayload";
import { UpdateMembershipSchema } from "../schemas/membership";
import { useCustomerStore } from "../store/customerStore";
import { Customer } from "../entity/customer";

export function useMembership() {
    const [loading, setLoading] = useState<boolean>(false);
    const {setCustomers, customers} = useCustomerStore();
    const registerMembership = async (payload: MembershipPayload) => {
        try {
            const res = await fetch('/api/membership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(res.statusText);
            const response: ApiResponse = await res.json();
            if (!response.success) throw new Error(response.message);
            return {
                error:false,
                message:response.message
            };
        } catch (error:any) {
            return {
                error:true,
                message:error.message
            }
        }
    }
    const updateMembership = async (membership:UpdateMembershipSchema) => {
        try {
            setLoading(true);
            const {id, ...rest} = membership;
            const res = await fetch(`/api/membership/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...rest}),
            })
            if (!res.ok) throw new Error(res.statusText);
            const response: ApiResponse = await res.json();
            if (!response.success) throw new Error(response.message);
            const updatedCustomers: Customer[] = customers.map(c => {
                const ms = c.membership_customers?.[0];
                if (ms && ms.memberships?.id === id) {
                    return {
                        ...c,
                        membership_customers: [{
                            ...ms,
                            memberships: {
                                ...ms.memberships,
                                ...rest,
                            },
                        }],
                    } as Customer;
                }
                return c;
            });
            setCustomers(updatedCustomers);
            return {
                error:false,
                message:response.message
            };
        } catch (error:any) {
            return {
                error:true,
                message:error.message
            }
        }finally{
            setLoading(false);
        }
    }
    return { updateMembership, registerMembership, loading, setLoading }
}