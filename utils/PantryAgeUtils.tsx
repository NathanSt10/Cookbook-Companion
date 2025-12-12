import { getDaysBetween, parseFirestoreDate } from './DateUtils';

export const DEFAULT_AGING_DAYS = 7;
export const DEFAULT_URGENT_DAYS = 14;

export type ItemStatus = 'fresh' | 'warning' | 'critical';

export const getItemAge = (addedAt: Date | any): number => {
  const addedDate = parseFirestoreDate(addedAt);
  const days = getDaysBetween(addedDate);
  
  return Math.max(0, days);
};

export const getItemStatus = (
  addedAt: Date | any,
  agingDays: number = DEFAULT_AGING_DAYS,
  urgentDays: number = DEFAULT_URGENT_DAYS
): ItemStatus => {
  const age = getItemAge(addedAt);

  if (age >= urgentDays) {
    return 'critical';
  }
  
  if (age >= agingDays) {
    return 'warning';
  }
  
  return 'fresh';
};

export const getStatusBadgeText = (status: ItemStatus): string | null => {
  switch (status) {
    case 'warning':
      return 'Aging';
    case 'critical':
      return 'Urgent';
    case 'fresh':
    default:
      return null;
  }
};

export const getStatusColor = (status: ItemStatus): string => {
  switch (status) {
    case 'warning':
      return 'darkorange';
    case 'critical':
      return 'firebrick';
    case 'fresh':
    default:
      return 'green';
  }
};

export const getStatusDate = (addedAt: Date | any, targetDays: number): Date => {
  const addedDate = parseFirestoreDate(addedAt);
  const targetDate = new Date(addedDate);
  targetDate.setDate(targetDate.getDate() + targetDays);
  return targetDate;
};

export const getDaysUntilStatus = (addedAt: Date | any, targetDays: number): number => {
  const age = getItemAge(addedAt);
  return targetDays - age;
};