import { MembershipPayload } from "@/app/entity/membershipPayload";
import { supabase } from "@/app/lib/supabaseClient";
import { createClient } from "@/app/lib/supabaseServerClient";
import { ApiResponse } from "@/app/types/api";

export async function POST(request: Request) {
    try {
        const supabaseServer = await createClient()
        const {data:{user}} = await supabaseServer.auth.getUser();
        if (!user) return new Response("Unauthorized", { status: 401 });
        
        const body = await request.json() as MembershipPayload;
        
        const { data, error } = await supabase.from('memberships').insert(body.membership).select();
        if(error){
            const res: ApiResponse = {
                success: false,
                message: error.message,
                type: 'server',
            }
            return Response.json(res, { status: 500 })
        }
        const membership_customers = body.ids.map(id=>({
            membership_id:data[0]?.id,
            customer_id:id
        }))
        const { error:errorMM } = await supabase.from('membership_customers').insert(membership_customers)
        if(errorMM){
            const res: ApiResponse = {
                success: false,
                message: errorMM.message,
                type: 'server',
            }
            return Response.json(res, { status: 500 })
        }
        const res: ApiResponse = {
            success: true,
            message: 'Suscripcion creada',
            type: 'success',
            data: data,
        }

        return Response.json(res, {status:201})

    } catch (error: any) {
        const res: ApiResponse = {
            success: false,
            message: error?.message,
            type: 'server',
        }
        return Response.json(res, { status: 500 })
    }
}