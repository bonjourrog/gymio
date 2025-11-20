import {z} from 'zod';
import { status } from '../data/membership';

export const updateMembershipSchema = z.object({
    id: z.uuid().optional(),
    package_id: z.string().optional(),
    status: z.enum(status).optional(),
    end_date: z.string().optional(),
    cancellation_date: z.string().optional(),
    is_archived: z.boolean().optional(),
    cancellation_reason: z.string().optional(),
});

export type UpdateMembershipSchema = z.infer<typeof updateMembershipSchema>;