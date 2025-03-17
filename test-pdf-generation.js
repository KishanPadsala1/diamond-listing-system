// This is a simple test script to verify PDF generation
// Run with: node test-pdf-generation.js

const jsPDF = require('jspdf').jsPDF;
const autoTable = require('jspdf-autotable').default;

function testPdfGeneration() {
  console.log('Testing PDF generation...');
  
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add some text
    doc.text('Test PDF Generation', 105, 20, { align: 'center' });
    
    // Create a simple table
    const tableColumn = ['ID', 'Name', 'Value'];
    const tableRows = [
      [1, 'Item 1', '$100'],
      [2, 'Item 2', '$200'],
      [3, 'Item 3', '$300'],
    ];
    
    // Add the table using autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
    });
    
    // Save the PDF
    doc.save('test-pdf.pdf');
    
    console.log('PDF generated successfully! Check test-pdf.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

testPdfGeneration(); 