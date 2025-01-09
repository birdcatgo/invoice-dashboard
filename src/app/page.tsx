import { getDashboardData } from './actions';
import DashboardClient from './_components/DashboardClient';

export default async function DashboardPage() {
  const data = await getDashboardData();
  console.log('Page data:', data);
  return <DashboardClient data={data} />;
}