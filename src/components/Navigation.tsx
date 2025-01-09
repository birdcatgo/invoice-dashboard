'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 h-16 items-center">
          <Link 
            href="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/to-be-invoiced"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/to-be-invoiced' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            To Be Invoiced
          </Link>
          <Link 
            href="/outstanding-invoices"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/outstanding-invoices' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Outstanding Invoices
          </Link>
          <Link 
            href="/paid-invoices"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              pathname === '/paid-invoices' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Paid Invoices
          </Link>
        </div>
      </div>
    </nav>
  );
} 