import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Broker, Diamond } from '../types';
import { formatCurrency, formatPercentage } from './helpers';
import emailjs from 'emailjs-com';
import { showWarningToast } from './toastUtils';

// Get EmailJS configuration from environment variables
const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID;
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

// Initialize EmailJS with user ID from environment variables
if (EMAILJS_USER_ID) {
  emailjs.init(EMAILJS_USER_ID);
} else {
  console.warn('EmailJS User ID not found in environment variables. Email functionality will not work.');
  showWarningToast('EmailJS configuration is missing. Email functionality will not work.');
}

interface InvoiceData {
  broker: Broker;
  diamonds: Diamond[];
  totalAmount: number;
  date: string;
  invoiceNumber: string;
}

export const generateInvoicePDF = (data: InvoiceData): jsPDF => {
  const { broker, diamonds, totalAmount, date, invoiceNumber } = data;
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210);
  doc.text('Diamond Listing System', 105, 20, { align: 'center' });
  
  // Add invoice title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 105, 30, { align: 'center' });
  
  // Add invoice details
  doc.setFontSize(10);
  doc.text(`Invoice Number: ${invoiceNumber}`, 20, 40);
  doc.text(`Date: ${new Date(date).toLocaleDateString()}`, 20, 45);
  
  // Add broker details
  doc.setFontSize(12);
  doc.text('Broker Details:', 20, 55);
  doc.setFontSize(10);
  doc.text(`Name: ${broker.name}`, 20, 60);
  doc.text(`Email: ${broker.email}`, 20, 65);
  doc.text(`Phone: ${broker.phone}`, 20, 70);
  doc.text(`Address: ${broker.address}`, 20, 75);
  doc.text(`Broker Rate: ${broker.brokerRate}%`, 20, 80);
  
  // Add diamond table
  const tableColumn = ['Stock No', 'Carat', 'Shape', 'Color', 'Clarity', 'RAP Price', 'Discount', 'PPC', 'Total'];
  const tableRows = diamonds.map(diamond => [
    diamond.stockNo,
    diamond.carat.toFixed(2),
    diamond.shape,
    diamond.color,
    diamond.clarity,
    formatCurrency(diamond.rapPrice),
    formatPercentage(diamond.discount),
    formatCurrency(diamond.ppc),
    formatCurrency(diamond.totalAmount)
  ]);
  
  // Use autoTable directly instead of doc.autoTable
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [25, 118, 210] }
  });
  
  // Get the final y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  // Add summary
  doc.setFontSize(10);
  doc.text(`Total Diamonds: ${diamonds.length}`, 140, finalY + 10);
  doc.text(`Total Carats: ${diamonds.reduce((sum, d) => sum + d.carat, 0).toFixed(2)}`, 140, finalY + 15);
  
  // Add total amount
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 140, finalY + 25);
  
  // Add footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', 105, finalY + 40, { align: 'center' });
  doc.text('Diamond Listing System Inc.', 105, finalY + 45, { align: 'center' });
  
  return doc;
};

export const downloadInvoice = (data: InvoiceData): void => {
  const doc = generateInvoicePDF(data);
  doc.save(`Invoice-${data.invoiceNumber}.pdf`);
};

export const sendInvoiceEmail = async (data: InvoiceData): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if EmailJS configuration is available
    if (!EMAILJS_USER_ID) {
      return { 
        success: false, 
        message: 'EmailJS User ID not found in environment variables' 
      };
    }
    
    if (!EMAILJS_SERVICE_ID) {
      return { 
        success: false, 
        message: 'EmailJS Service ID not found in environment variables' 
      };
    }
    
    if (!EMAILJS_TEMPLATE_ID) {
      return { 
        success: false, 
        message: 'EmailJS Template ID not found in environment variables' 
      };
    }

    // Generate PDF and convert to base64
    const doc = generateInvoicePDF(data);
    const pdfBase64 = doc.output('datauristring');
    
    // Calculate total carats
    const totalCarats = data.diamonds.reduce((sum, d) => sum + d.carat, 0).toFixed(2);
    
    // Prepare email template parameters
    const templateParams = {
      to_name: data.broker.name,
      to_email: data.broker.email,
      invoice_number: data.invoiceNumber,
      invoice_date: new Date(data.date).toLocaleDateString(),
      total_amount: formatCurrency(data.totalAmount),
      total_diamonds: data.diamonds.length,
      total_carats: totalCarats,
      pdf_attachment: pdfBase64,
      message: `Please find attached the invoice for your recent purchase of ${data.diamonds.length} diamonds totaling ${totalCarats} carats.`
    };
    
    console.log('Sending email with EmailJS...');
    
    // Send email using EmailJS with environment variables
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('EmailJS response:', response);
    
    if (response.status === 200) {
      return { 
        success: true, 
        message: `Email successfully sent to ${data.broker.email}` 
      };
    } else {
      return { 
        success: false, 
        message: `Failed to send email. Status: ${response.status}` 
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending email:', error);
    return { 
      success: false, 
      message: `Error sending email: ${errorMessage}` 
    };
  }
};

// Generate a unique invoice number
export const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}; 