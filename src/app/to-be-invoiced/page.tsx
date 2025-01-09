// This is a Server Component
import { getDashboardData } from '@/lib/actions';
import ToBeInvoicedClient from '../_components/ToBeInvoicedClient';

export default async function ToBeInvoicedPage() {
  const data = await getDashboardData();
  return <ToBeInvoicedClient data={data} />;
} 