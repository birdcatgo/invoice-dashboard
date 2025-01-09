'use client';

import { ReactNode } from 'react';
import PageHeader from './PageHeader';

interface Props {
  title: string;
  children: ReactNode;
}

export default function InvoicePageLayout({ title, children }: Props) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title={title} onRefresh={handleRefresh} />
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 