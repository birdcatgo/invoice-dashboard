// This is a Server Component
import { getDashboardData } from '@/app/actions';
import ToBeInvoicedClient from './client';

export default async function ToBeInvoicedPage() {
  const data = await getDashboardData();
  return <ToBeInvoicedClient data={data} />;
} 