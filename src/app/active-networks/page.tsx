import { getActiveNetworksWithTotals } from '@/lib/data';
import { getPSTDateRange, formatCurrency } from '@/lib/utils';

export default async function ActiveNetworksPage() {
  const targetDate = new Date('2024-01-06');
  const { displayRange } = getPSTDateRange(targetDate);
  const networks = await getActiveNetworksWithTotals(targetDate);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Active Networks</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Period: {displayRange} (PST)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Network</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Offer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pay Period</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Running Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {networks.map((network, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{network.network}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">{network.offer}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">{network.payPeriod}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(network.runningTotal)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                <td colSpan={2}></td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  {formatCurrency(networks.reduce((sum, n) => sum + n.runningTotal, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 