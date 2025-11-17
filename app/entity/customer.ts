import { Membership } from "./membership";

export interface Customer{
    id?: string;
    name: string;
    email?:string;
    phone:string;
    updated_at?:Date;
    created_at?:Date;
    owner_id?:string;
    membership_customers?:MembershipCustomers[];
}
interface MembershipCustomers{
    memberships?:Membership;
}