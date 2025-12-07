import { createClient } from "@/app/lib/supabaseServerClient";
import { ApiResponse } from "@/app/types/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient()
        const now = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase.from('check_ins').select()
        .gte('check_in_date', `${now} 00:00:00z`)
        .lte('check_in_date', `${now} 23:59:59Z`)
        if (error) {
            const res: ApiResponse = {
                message: 'Ocurrio un error al buscar las asistencias',
                success: false,
                type: 'server',
                data: []
            }
            console.log(error);
            
            return NextResponse.json(res)
        }
        const res: ApiResponse = {
            message: 'peticion exitosa',
            success: true,
            type: 'success',
            data
        }
        return NextResponse.json(res)
    } catch (error: any) {
        const res: ApiResponse = {
            message: error?.message,
            success: false,
            type: 'server',
            data: []
        }
        return NextResponse.json(res)
    }
}
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const supabase = await createClient()
        
        const { data, error } = await supabase.from('check_ins').insert(body);
        if (error) {
            const res: ApiResponse = {
                message: error?.message,
                success: false,
                type: 'server',
                data: []
            }
            return NextResponse.json(res)
        }
        const res: ApiResponse = {
            message: 'peticion exitosa',
            success: true,
            type: 'success',
            data
        }
        return NextResponse.json(res)
    } catch (error: any) {
        const res: ApiResponse = {
            message: error?.message,
            success: false,
            type: 'server',
            data: []
        }
        return NextResponse.json(res)
    }
}