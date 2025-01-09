import { getDashboardData } from '@/lib/actions';
import DashboardClient from './_components/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}