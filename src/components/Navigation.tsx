'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto px-3">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-900">
              Convert 2 Freedom Accounts Receivable
            </span>
          </div>
          <div className="flex space-x-6">
            <Link 
              href="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/') 
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/to-be-invoiced"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/to-be-invoiced')
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              To Be Invoiced
            </Link>
            <Link 
              href="/outstanding-invoices"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/outstanding-invoices')
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Outstanding
            </Link>
            <Link 
              href="/paid-invoices"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/paid-invoices')
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Paid
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 