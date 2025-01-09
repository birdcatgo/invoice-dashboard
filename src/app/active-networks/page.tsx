import { getActiveNetworksWithTotals } from '@/lib/data';
import { getPSTDateRange } from '@/lib/utils';

export default async function ActiveNetworksPage() {
  const targetDate = new Date('2024-01-06');
  const { displayRange } = getPSTDateRange(targetDate);
  const networks = await getActiveNetworksWithTotals();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Active Networks</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          Period: {displayRange} (PST)
        </h2>
        
        <table className="w-full mt-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Network</th>
              <th className="text-right py-2">Running Total</th>
            </tr>
          </thead>
          <tbody>
            {networks.map((network, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{network.network}</td>
                <td className="py-2 text-right">${network.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 