import { supabase } from "@/app/lib/supabaseClient";
import { ApiResponse } from "@/app/types/api";
import { NextResponse } from "next/server";

interface RouteParams {
    id: string;
}

export async function DELETE(request: Request, { params }: { params: RouteParams }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ success: false, message: 'No se recibió ID' }, { status: 400 });
        }
        const { data, error } = await supabase.rpc('archive_package',{p_id:id});

        if (error) {
            const res: ApiResponse = {
                success: false,
                message: error.message,
                type: 'server'
            }
            return NextResponse.json(res, { status: 500 })
        }
        const res: ApiResponse = {
            success: true,
            message: 'package registered successfully',
            type: 'success',
            data: data,
        }
        return NextResponse.json(res, { status: 200 })
    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error.message,
            type: 'server',
            code: '',
        }
        return NextResponse.json(res, { status: 500 })
    }
}
export async function PUT(req: Request, { params }: { params: RouteParams }) {
    try {
        const { id } = await params;
        const body = await req.json()
        if (!id) {
            return NextResponse.json({ success: false, message: 'No se recibió ID' }, { status: 400 });
        }
        const { data, error } = await supabase.from('packages').update(body).eq('id', id)
        if (error) {
            const res: ApiResponse = {
                success: false,
                message: error.message,
                type: 'server',
                code: '',
            }
            return NextResponse.json(res, { status: 500 })
        }
        const res: ApiResponse = {
            success: true,
            message: 'package upadted successfully',
            type: 'success',
            code:'PACKAGE_UPDATED',
            data: data,
        }
        return NextResponse.json(res, { status: 200 })
    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error.message,
            type: 'server',
            code: '',
        }
        return NextResponse.json(res, { status: 500 })
    }
}