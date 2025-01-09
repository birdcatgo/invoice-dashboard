import PaidInvoicesClient from '../_components/PaidInvoicesClient';
import { getDashboardData } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function PaidInvoicesPage() {
  const data = await getDashboardData();
  return <PaidInvoicesClient data={data} />;
} 