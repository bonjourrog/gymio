import { create } from "zustand";
import { Package } from "../entity/package";

export interface PackageState{
    packages:Package[];
    _package:Package;
    setPackages:(packages:Package[])=>void;
    setPackage:(_package:Package)=>void;
    addPackage:(newPackage:Package)=>void;
}

export const usePackageStore = create<PackageState>(set=>({
    packages:[],
    setPackages:(packages:Package[])=>set({packages}),
    addPackage:(newPackage:Package)=>{
        set(state=>({
            packages:[...state.packages, newPackage]
        }))
    },
    _package:{} as Package,
    setPackage:(_package:Package)=>set({_package})
}))