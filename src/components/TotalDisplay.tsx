import { formatCurrency } from '@/lib/utils';

interface Props {
  label: string;
  amount: number;
}

export default function TotalDisplay({ label, amount }: Props) {
  return (
    <div className="bg-white rounded-md shadow border border-gray-200 p-4">
      <dt className="text-sm font-medium text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">
        {formatCurrency(amount)}
      </dd>
    </div>
  );
} 