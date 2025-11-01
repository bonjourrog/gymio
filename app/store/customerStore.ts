import { create } from "zustand";
import { Customer } from "../entity/customer";

interface CustomerState{
    customers:Customer[];
    setCustomers:(customers:Customer[])=>void;
}

export const useCustomerStore = create<CustomerState>(set=>({
    customers:[],
    setCustomers:(customers:Customer[])=>set({customers})
}))