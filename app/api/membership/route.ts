// import { createClient } from "@/app/lib/supabaseServerClient";

// export async function POST(request: Request) {
//     try {
//         const supabaseServer = await createClient()
//         const {data:{user}} = await supabaseServer.auth.getUser();
//         if (!user) return new Response("Unauthorized", { status: 401 });
        
//         const body = await request.json()
//         body.owner_id = user?.id;
//         const { data, error } = await supabase.from('customers').insert([body])
//         if (error) {
//             const res: ApiResponse = {
//                 success: false,
//                 message: error.message,
//                 type: 'server',
//             }
//             return Response.json(res, { status: 500 })
//         }
//         const res: ApiResponse = {
//             success: true,
//             message: 'Nuevo cliente creado',
//             type: 'success',
//             data: data,
//         }

//         return Response.json(res)

//     } catch (error: any) {
//         const res: ApiResponse = {
//             success: false,
//             message: error?.message,
//             type: 'server',
//         }
//         return Response.json(res, { status: 500 })
//     }
// }