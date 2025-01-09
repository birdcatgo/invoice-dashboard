import { getDashboardData } from '@/app/actions';
import OutstandingClient from './outstanding-client';

export default async function OutstandingInvoicesPage() {
  const data = await getDashboardData();
  return <OutstandingClient data={data} />;
} 