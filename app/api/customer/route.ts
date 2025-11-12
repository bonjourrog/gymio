import { Customer } from '@/app/entity/customer';
import { supabase } from '@/app/lib/supabaseClient';
import { createClient } from '@/app/lib/supabaseServerClient';
import { ApiResponse } from '@/app/types/api';

export async function POST(request: Request) {
    try {
        const supabaseServer = await createClient()
        const {data:{user}} = await supabaseServer.auth.getUser();
        if (!user) return new Response("Unauthorized", { status: 401 });
        
        const body = await request.json() as Customer[]
        const customers:Customer[] = body.map(customer=>({...customer, owner_id:user?.id}))
        const { data, error } = await supabase.from('customers').insert(customers).select();
        if (error) {
            const res: ApiResponse = {
                success: false,
                message: error.message,
                type: 'server',
            }
            return Response.json(res, { status: 500 })
        }
        const res: ApiResponse = {
            success: true,
            message: 'Nuevo cliente creado',
            type: 'success',
            data: data,
        }

        return Response.json(res)

    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error?.message,
            type: 'server',
        }
        return Response.json(res, { status: 500 })
    }
}
export async function GET(request: Request) {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select(`
                id,
                name,
                phone,
                membership_customers (
                memberships (
                    id,
                    start_date,
                    end_date,
                    packages (
                    id,
                    name,
                    price
                    )
                )
                )
            `);
            
        // const { data, error } = await supabase.from('customers').select();
        if (error) {
            const res: ApiResponse = {
                success: false,
                message: error.message,
                type: 'server',
            }
            return Response.json(res, { status: 500 })
        }
        const res: ApiResponse = {
            success: true,
            message: 'success',
            type: 'server',
            data:data
        }
        return Response.json(res, { status: 500 })
    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error?.message,
            type: 'server',
        }
        return Response.json(res, { status: 500 })
    }
}
