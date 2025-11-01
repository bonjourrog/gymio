import { create } from "zustand";
import { Package } from "../entity/package";

export interface PackageState{
    packages:Package[];
    setPackages:(packages:Package[])=>void;
}

export const usePackageStore = create<PackageState>(set=>({
    packages:[],
    setPackages:(packages:Package[])=>set({packages})
}))