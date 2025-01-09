import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid, parse, startOfWeek, endOfWeek, addHours } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  try {
    if (!date) {
      return 'No date';
    }
    
    if (typeof date === 'string') {
      // Handle empty or whitespace-only strings
      if (!date.trim()) {
        return 'No date';
      }
      
      // Try parsing ISO format first
      let parsedDate = parseISO(date);
      
      // If that fails, try other common formats
      if (!isValid(parsedDate)) {
        // Try DD/MM/YYYY
        parsedDate = parse(date, 'dd/MM/yyyy', new Date());
        
        // Try YYYY-MM-DD
        if (!isValid(parsedDate)) {
          parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        }
        
        // Try MM/DD/YYYY
        if (!isValid(parsedDate)) {
          parsedDate = parse(date, 'MM/dd/yyyy', new Date());
        }
      }
      
      if (!isValid(parsedDate)) {
        return 'Invalid date';
      }
      
      return format(parsedDate, 'dd/MM/yyyy');
    }
    
    // Handle Date object
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, 'dd/MM/yyyy');
  } catch {
    return 'Invalid date';
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(dueDate: string): boolean {
  const today = new Date();
  const due = new Date(dueDate);
  return today > due;
}

export function getPSTDateRange(date: Date) {
  // PST is UTC-8, so we'll add 8 hours to get PST time
  const pstDate = addHours(date, 8);
  
  // Get start of week (Monday) and end of week (Sunday)
  const startDate = startOfWeek(pstDate, { weekStartsOn: 1 }); // 1 = Monday
  const endDate = endOfWeek(pstDate, { weekStartsOn: 1 });
  
  return {
    startDate,
    endDate,
    displayRange: `${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM yyyy')}`
  };
}

export function formatPSTDate(date: Date): string {
  const pstDate = addHours(date, 8);
  return format(pstDate, 'dd/MM/yyyy');
}

export function getInvoiceStatusColor(dueDate: string): string {
  const today = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 'text-red-600 font-medium'; // Overdue
  if (daysUntilDue <= 7) return 'text-yellow-600 font-medium'; // Due soon
  return 'text-green-600'; // Not due yet
}

export function getInvoiceStatus(dueDate: string): string {
  const today = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 'Overdue';
  if (daysUntilDue <= 7) return 'Due Soon';
  return 'Not Due';
}