import { create } from "zustand";
import { CustomerCheckin } from "../entity/customerChecikn";

interface CheckinState{
    customerCheckIns:CustomerCheckin[];
}
interface CheckinActions{
    addCheckins:(customerCheckIns:CustomerCheckin[])=>void;
}

export const useCheckinStore = create<CheckinState&CheckinActions>(set=>({
    customerCheckIns:[],
    addCheckins:(customerCheckIns:CustomerCheckin[])=>set({customerCheckIns})
}))