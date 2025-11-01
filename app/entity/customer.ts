export interface Customer{
    id?: string;
    name: string;
    email?:string;
    phone:string;
    package_id: string;
    updated_at?:Date;
    created_at?:Date;
}