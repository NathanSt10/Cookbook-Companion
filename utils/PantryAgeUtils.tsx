export const getItemAge = (addedAt: Date): number => {
  const now = new Date();
  const ageInMs = now.getTime() - addedAt.getTime();
  return Math.floor(ageInMs / (1000 * 60 * 60 * 24));
};

export type ItemStatus = 'fresh' | 'warning' | 'critical';

export const DEFAULT_AGING_DAYS = 7;
export const DEFAULT_URGENT_DAYS = 14;

export const getItemStatus = (
  addedAt: Date,
  warningDays: number = DEFAULT_AGING_DAYS,
  criticalDays: number = DEFAULT_URGENT_DAYS 
): ItemStatus => {
  const age = getItemAge(addedAt);
  if (age >= criticalDays) return 'critical';
  if (age >= warningDays) return 'warning';
  return 'fresh';
};

export const getStatusColor = (status: ItemStatus): string => {
  switch (status) {
    case 'critical': return 'firebrick';  
    case 'warning': return 'goldenrod';     
    case 'fresh': return 'forestgreen';      
  }
};

export const getStatusBadgeText = (status: ItemStatus): string => {
  switch (status) {
    case 'critical': return 'Urgent';
    case 'warning': return 'Aging';
    case 'fresh': return 'Good';
  }
};