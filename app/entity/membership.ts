import { MembershipStatus } from "../data/membership";
import { Package } from "./package";

export interface Membership {
    id?: string;
    package_id: string;
    status: MembershipStatus;
    start_date: string;
    end_date: string;
    packages?:Package;
    cancellation_date?: string;
    is_archived?: boolean;
    cancellation_reason?: string;
}