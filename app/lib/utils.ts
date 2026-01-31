import { Customer } from "../entity/customer";

// Asigna color por membership_id
export const getMembershipColor = (colorMap: Record<string, string>, membershipId?: string) => {
    const colors = [
        'bg-[#e8f1ec] text-[#4a6657]',
        'bg-[#ebe9f5] text-[#5d5477]',
        'bg-[#f8ede9] text-[#7a574a]',
        'bg-[#e9f2f9] text-[#4a5f7a]',
        'bg-[#f5e9ed] text-[#7a4a5f]',
        // 'bg-[#f9f8fc]',
    ];
    if (!membershipId) return ''; // sin membresía, fondo normal

    if (!colorMap[membershipId]) {
        const nextColor = colors[Object.keys(colorMap).length % colors.length];
        colorMap[membershipId] = nextColor;
    }

    return colorMap[membershipId];
}
export const getCustomerWithMembership = (customers: Customer[]):Customer[] => {
    const allowedStatuses = ['active', 'expired'];
    return customers.filter(c => c.membership_customers?.some(mc=>(
        allowedStatuses.includes(mc.memberships?.status as string)
    )));
}