import OutstandingInvoicesClient from '../_components/OutstandingInvoicesClient';
import { getDashboardData } from '@/lib/actions';

export default async function OutstandingInvoicesPage() {
  const data = await getDashboardData();
  return <OutstandingInvoicesClient data={data} />;
} 