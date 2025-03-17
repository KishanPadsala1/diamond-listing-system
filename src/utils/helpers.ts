import { Diamond } from '../types';

// Generate a random stock number (7 digits + 3 uppercase letters)
export const generateStockNo = (): string => {
  const digits = Math.floor(1000000 + Math.random() * 9000000).toString();
  const letters = Array(3)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('');
  return digits + letters;
};

// Calculate PPC (Price Per Carat) based on RAP price and discount
export const calculatePPC = (rapPrice: number, discount: number): number => {
  return rapPrice + (rapPrice * discount) / 100;
};

// Calculate total amount based on PPC and carat
export const calculateTotalAmount = (ppc: number, carat: number): number => {
  return ppc * carat;
};

// Calculate summary matrix for diamonds
export const calculateSummaryMatrix = (
  diamonds: Diamond[],
  selectedDiamonds: Diamond[]
) => {
  const totalQty = diamonds.length;
  const selectedQty = selectedDiamonds.length;

  const totalCts = diamonds.reduce((sum, diamond) => sum + diamond.carat, 0);
  const selectedCts = selectedDiamonds.reduce((sum, diamond) => sum + diamond.carat, 0);

  const totalAmount = diamonds.reduce((sum, diamond) => sum + diamond.totalAmount, 0);
  const selectedAmount = selectedDiamonds.reduce((sum, diamond) => sum + diamond.totalAmount, 0);

  const avgDisTotal = totalAmount / totalCts || 0;
  const avgDisSelected = selectedAmount / selectedCts || 0;

  return {
    qty: {
      total: totalQty,
      selected: selectedQty,
    },
    totalCts: {
      total: totalCts,
      selected: selectedCts,
    },
    avgDis: {
      total: avgDisTotal,
      selected: avgDisSelected,
    },
    totalAmount: {
      total: totalAmount,
      selected: selectedAmount,
      billAmount: selectedAmount,
    },
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format percentage
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
}; 