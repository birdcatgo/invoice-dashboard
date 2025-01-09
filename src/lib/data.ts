import { NetworkTerms, DashboardData } from './types';
import { getDashboardData } from '@/app/actions';

export async function getActiveNetworksWithTotals(): Promise<NetworkTerms[]> {
  try {
    const data: DashboardData = await getDashboardData();
    return data.networkTerms.filter((network) => network.runningTotal > 0);
  } catch (error) {
    console.error('Error fetching network data:', error);
    return [];
  }
} 