'use client';

import { useState } from 'react';
import { DashboardData, Invoice } from '@/lib/types';
import ClientInvoiceTable from '@/components/ClientInvoiceTable';

interface Props {
  data: DashboardData;
}

export default function OutstandingInvoicesClient({ data }: Props) {
  // ... existing component code ...
} 