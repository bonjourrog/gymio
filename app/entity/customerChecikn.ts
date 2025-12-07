import { Checkin } from "./checkin";

export  interface CustomerCheckin{
    customer_name:string;
    package_name:string;
    checkin:Checkin;
}