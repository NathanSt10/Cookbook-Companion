export const getItemAge = (addedAt: Date): number => {
  const now = new Date();
  const ageInMs = now.getTime() - addedAt.getTime();
  return Math.floor(ageInMs / (1000 * 60 * 60 * 24));
};

export type ItemStatus = 'fresh' | 'warning' | 'critical';

export const getItemStatus = (
  addedAt: Date,
  warningDays: number = 7,
  criticalDays: number = 14
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
    case 'critical': return 'Soon';
    case 'warning': return 'Aging';
    case 'fresh': return 'Good';
  }
};