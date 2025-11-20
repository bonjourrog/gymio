import { supabase } from "@/app/lib/supabaseClient";
import { createClient } from "@/app/lib/supabaseServerClient";
import { updateMembershipSchema } from "@/app/schemas/membership";
import { ApiResponse } from "@/app/types/api";

interface RouteParams {
    id: string;
}
export async function PUT(request: Request, { params }: { params: RouteParams }) {
    try {
        const supabaseServer = await createClient()
        const { data: { user } } = await supabaseServer.auth.getUser();
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = await request.json();
        const {id} = await params;

        const validatedData = updateMembershipSchema.parse(body);
        const { ...updateFields } = validatedData;

        const { data, error } = await supabase.from('memberships').update(updateFields).eq('id', id).select();
        
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
            message: 'Suscripcion actualizada',
            type: 'success',
            data: data,
        }

        return Response.json(res, { status: 200 })

    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error?.message,
            type: 'server',
        }
        return Response.json(res, { status: 500 })
    }
}