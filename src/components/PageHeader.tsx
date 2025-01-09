'use client';

interface Props {
  title: string;
  onRefresh?: () => void;
}

export default function PageHeader({ title, onRefresh }: Props) {
  return (
    <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-3">
      <h1 className="text-lg font-medium text-gray-900">{title}</h1>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      )}
    </div>
  );
} 