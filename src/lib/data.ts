import { DashboardData } from './types';
import { getDashboardData } from '@/app/actions';

export async function getActiveNetworksWithTotals(date: Date) {
  try {
    const data = await getDashboardData();
    
    return data.networkTerms
      .map((network) => ({
        ...network,
        total: network.runningTotal || 0,
      }))
      .filter((network) => network.runningTotal > 0);
      
  } catch (error) {
    console.error('Error fetching network data');
    return [];
  }
} 