import { supabase } from '@/app/lib/supabaseClient';
import { ApiResponse } from '@/app/types/api';

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { data, error } = await supabase.from('customers').insert([body])
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
        const { data, error } = await supabase.from('customers').select();
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
