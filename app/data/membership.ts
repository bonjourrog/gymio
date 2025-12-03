export const status = ['active', 'expired', 'paused', 'canceled', 'refunded'] as const;

export type MembershipStatus = (typeof status)[number];
