export const status = ['active', 'expired', 'paused', 'canceled'] as const;

export type MembershipStatus = (typeof status)[number];
