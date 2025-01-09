'use client';

import Header from './Header';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function InvoicePageLayout({ title, children }: Props) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <Header showRefresh={true} />
      </div>
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="bg-white rounded-lg shadow">
        {children}
      </div>
    </div>
  );
} 