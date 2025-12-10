import { createClient } from "@/app/lib/supabaseServerClient";
import { ApiResponse } from "@/app/types/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient()
        const startUTC = new Date();
        // inicio del día local del usuario → a UTC
        startUTC.setHours(0, 0, 0, 0);
        const start = startUTC.toISOString();
        // fin del día local del usuario → a UTC
        const endUTC = new Date();
        endUTC.setHours(23, 59, 59, 999);
        const end = endUTC.toISOString();
        const { data, error } = await supabase.from('check_ins').select()
            .gte('check_in_date', start)
            .lte('check_in_date', end)
        if (error) {
            const res: ApiResponse = {
                message: 'Ocurrio un error al buscar las asistencias',
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
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const supabase = await createClient()
        
        const { data, error } = await supabase.from('check_ins').insert(body).select();
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