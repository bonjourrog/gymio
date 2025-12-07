import { createClient } from "@/app/lib/supabaseServerClient";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.from('check_ins').select()
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
