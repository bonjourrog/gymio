import { useState } from "react";
import { useCustomerStore } from "../store/customerStore";
import { ApiResponse } from "../types/api";
import { Customer } from "../entity/customer";

export function useUser() {
    const { customers, setCustomers } = useCustomerStore();
    const [loading, setLoading] = useState<boolean>(false);
    const getUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/customer', {
                method: 'GET'
            })
            const data: ApiResponse = await res.json();
            if (!data.success) {
                throw new Error(data.message);
            }
            setCustomers(data.data);
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    const registerUser = async (newCustomer: Customer) => {
        try {
            setLoading(true);
            const res = await fetch('/api/customer', {
                method: 'POST',
                body: JSON.stringify(newCustomer)
            });
            if (!res.ok) throw new Error(res.statusText);
            const response: ApiResponse = await res.json();
            if (!response.success) throw new Error(response.message)
            console.log('usuario creado, ', response.data);
            setCustomers([...customers, ...response.data])
            return {
                error: false,
                message: 'Cliente registrado'
            }

        } catch (error: any) {
            return {
                error: true,
                message: error.message
            }
        } finally {
            setLoading(false);
        }
    }

    return { getUsers, registerUser, loading }
}