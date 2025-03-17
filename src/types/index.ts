export interface Broker {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  brokerRate: number;
  isActive: boolean;
}

export interface Diamond {
  id: number;
  stockNo: string;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  rapPrice: number;
  discount: number;
  ppc: number;
  totalAmount: number;
}

export interface Transaction {
  id: number;
  brokerId: number;
  date: string;
  diamonds: number[];
  totalAmount: number;
}

export interface SummaryMatrix {
  qty: {
    total: number;
    selected: number;
  };
  totalCts: {
    total: number;
    selected: number;
  };
  avgDis: {
    total: number;
    selected: number;
  };
  totalAmount: {
    total: number;
    selected: number;
    billAmount: number;
  };
} 