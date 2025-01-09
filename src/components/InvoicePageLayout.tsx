'use client';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function InvoicePageLayout({ title, children }: Props) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {children}
      </div>
    </div>
  );
} 