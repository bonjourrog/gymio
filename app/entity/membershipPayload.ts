import { Membership } from "./membership";

export interface MembershipPayload{
    membership: Membership;
    ids:string[];
}