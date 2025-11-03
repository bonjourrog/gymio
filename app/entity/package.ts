export interface Package{
    id?:string;
    name:string;
    price: number;
    benefits:string[];
    duration_days:number;
    group_size:number;
    is_active:boolean;
    updated_at?:Date;
    created_at?:Date;
}