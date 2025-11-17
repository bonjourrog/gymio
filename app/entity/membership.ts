import { Package } from "./package";

export interface Membership {
    id?: string;
    package_id: string;
    status: string;
    start_date: string;
    end_date: string;
    packages?:Package;
}