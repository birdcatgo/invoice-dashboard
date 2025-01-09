import { getDashboardData } from '@/app/actions';
import PaidInvoicesClient from './client';

export default async function PaidInvoicesPage() {
  const data = await getDashboardData();
  return <PaidInvoicesClient data={data} />;
} 