import { useState } from "react"
import { Membership } from "../entity/membership";
import { ApiResponse } from "../types/api";
import { MembershipPayload } from "../entity/membershipPayload";

export function useMembership() {
    const [loading, setLoading] = useState<boolean>(false);
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
    return { registerMembership, loading, setLoading }
}