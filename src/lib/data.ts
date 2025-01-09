import { Network } from './types';
import { getPSTDateRange } from './utils';
import { getDashboardData } from '../app/actions';

export async function getActiveNetworksWithTotals(date: Date) {
  const { startDate, endDate } = getPSTDateRange(date);
  
  try {
    const data = await getDashboardData();
    
    return data.networkTerms
      .map((network) => ({
        ...network,
        total: network.runningTotal || 0,
      }))
      .filter((network) => network.runningTotal > 0);
      
  } catch (error) {
    console.error('Error fetching network data:', error);
    return [];
  }
} 