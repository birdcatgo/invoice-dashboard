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
      <div className="mx-auto px-3 py-4">
        <PageHeader title={title} onRefresh={handleRefresh} />
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-3 py-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 