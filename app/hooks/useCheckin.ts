import { useState } from "react"
import { useCheckinStore } from "../store/checkin";
import { useCustomerStore } from "../store/customerStore";

export const useCheckin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const addCheckins = useCheckinStore(s => s.addCheckins);
    const customerCheckIns = useCheckinStore(s => s.customerCheckIns);
    const customers = useCustomerStore(s => s.customers);
    
    return { isLoading }
}