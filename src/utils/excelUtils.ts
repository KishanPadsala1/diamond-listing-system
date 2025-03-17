import * as XLSX from 'xlsx';
import { Diamond } from '../types';
import { calculatePPC, calculateTotalAmount, generateStockNo } from './helpers';

export const parseExcelFile = (file: File): Promise<Diamond[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const diamonds: Diamond[] = jsonData.map((row: any) => {
          // Map Excel columns to Diamond properties
          const rapPrice = parseFloat(row.rapPrice) || 0;
          const discount = parseFloat(row.discount) || 0;
          const carat = parseFloat(row.carat) || 0;
          const ppc = calculatePPC(rapPrice, discount);
          const totalAmount = calculateTotalAmount(ppc, carat);

          return {
            id: 0, // Will be assigned by the server
            stockNo: row.stockNo || generateStockNo(),
            carat,
            shape: row.shape || '',
            color: row.color || '',
            clarity: row.clarity || '',
            rapPrice,
            discount,
            ppc,
            totalAmount,
          };
        });

        resolve(diamonds);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const exportToExcel = (diamonds: Diamond[], fileName: string = 'diamonds.xlsx'): void => {
  const worksheet = XLSX.utils.json_to_sheet(diamonds);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Diamonds');
  XLSX.writeFile(workbook, fileName);
}; 