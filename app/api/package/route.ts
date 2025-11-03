import { supabase } from '@/app/lib/supabaseClient';
import { ApiResponse } from '@/app/types/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { data: packages, error } = await supabase.from('packages').select()
        if (error) {
            const res: ApiResponse = {
                success: false,
                message: error.message,
                type: 'server',
            }
            return Response.json(res, { status: 500 })
        }
        if (!packages || packages.length === 0) {
            const res: ApiResponse = {
                success: false,
                message: 'no package created',
                type: 'dependency',
                code: 'MISSING_PACKAGE',
            }
            return Response.json(res, { status: 400 })
        }
        const res: ApiResponse = {
            success: true,
            message: 'getting al packages successful',
            type: 'success',
            data: packages,
        }
        return Response.json(res, { status: 200 })

    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error.message,
            type: 'server',
            code: '',
        }
        return Response.json(res, { status: 500 })
    }
}
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { data, error } = await supabase.from('packages').insert(body).select();
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
            message: 'package registered successfully',
            type: 'success',
            code:'PACKAGE_CREATED',
            data: data[0],
        }
        return Response.json(res, { status: 200 })
    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error.message,
            type: 'server',
            code: '',
        }
        return Response.json(res, { status: 500 })
    }
}