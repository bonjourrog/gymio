import { supabase } from "@/app/lib/supabaseClient";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";

interface RouteParams {
    id: string;
}
export async function DELETE(request: Request, { params }: { params: Promise<RouteParams> }) {
    try {
        const {id} = await params;
        const { data, error } = await supabase.from('check_ins').delete().eq('id', id);
        if (error) {
            
            throw new Error('ocurrio un error al eliminar la asistencia');
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
            message: error.message,
            success: false,
            data: [],
            type: 'server'
        }
        return NextResponse.json(res);
    }

}