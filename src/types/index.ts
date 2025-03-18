export interface Broker {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  brokerRate: number;
  isActive: boolean;
}

export enum DiamondShape {
  ROUND = 'Round',
  PRINCESS = 'Princess',
  CUSHION = 'Cushion', 
  EMERALD = 'Emerald',
  OVAL = 'Oval',
  RADIANT = 'Radiant',
  PEAR = 'Pear',
  HEART = 'Heart',
  MARQUISE = 'Marquise',
  ASSCHER = 'Asscher'
}

export enum DiamondColor {
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M'
}

export enum DiamondClarity {
  FL = 'FL',
  IF = 'IF',
  VVS1 = 'VVS1',
  VVS2 = 'VVS2',
  VS1 = 'VS1',
  VS2 = 'VS2',
  SI1 = 'SI1',
  SI2 = 'SI2',
  I1 = 'I1',
  I2 = 'I2',
  I3 = 'I3'
}

export interface Diamond {
  id: number;
  stockNo: string;
  carat: number;
  shape: DiamondShape;
  color: DiamondColor;
  clarity: DiamondClarity;
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