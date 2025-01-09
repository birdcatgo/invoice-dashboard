// src/lib/types.ts

export interface NetworkConfig {
    name: string;
    paymentTerms: number;
    reminderDays: number[];
    gracePeriod: number;
    contactEmail?: string;
  }
  
  export interface NetworkPaymentTerms {
    name: string;
    netTerms: number;
    payPeriod: 'weekly' | 'monthly';
    otherBusinessNames?: string;
    parentNetwork?: string; // For ACA sub-networks
  }
  
  export interface Transaction {
    date: string;
    network: string;
    offer: string;
    mediaBuyer: string;
    adSpend: number;
    adRevenue: number;
    commentRevenue: number;
    totalRevenue: number;
    margin: number;
    expectedPayment: string;
  }
  
  export interface Invoice {
    network: string;
    amount: number;
    dueDate: string;
    notes?: string;
  }
  
  export interface InvoicePeriod {
    network: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    transactions: Transaction[];
    dueDate: string;
    status: 'pending' | 'ready' | 'generated' | 'paid';
  }
  
  export interface NetworkSchedule {
    network: string;
    offer: string;
    paymentTerms: string;
    dailyCap: number;
    dailyBudget: number;
    currentExposure: number;
    riskLevel: string;
  }
  
  export interface Network {
    id: string;
    name: string;
    isActive: boolean;
    total?: number;
    clicks?: number;
    conversions?: number;
  }
  
  export interface NetworkTerms {
    network: string;
    offer: string;
    payPeriod: string;
    netTerms: number;
    periodStart: string;
    periodEnd: string;
    invoiceDue: string;
    runningTotal: number;
  }
  
  export interface DashboardData {
    networkTerms: NetworkTerms[];
    toBeInvoiced: Invoice[];
    invoices: Invoice[];
    paidInvoices: Invoice[];
  }