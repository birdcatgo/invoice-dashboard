'use client';

import { Invoice } from './types';

export async function handleMarkAsInvoiced(invoice: Invoice) {
  try {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'markAsInvoiced',
        invoice
      }),
    });

    if (!response.ok) throw new Error('Failed to mark as invoiced');
    window.location.reload();
  } catch (error) {
    console.error('Error marking as invoiced:', error);
  }
}

export async function handleMarkAsPaid(invoice: Invoice) {
  try {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'markAsPaid',
        invoice
      }),
    });

    if (!response.ok) throw new Error('Failed to mark as paid');
    window.location.reload();
  } catch (error) {
    console.error('Error marking as paid:', error);
  }
} 