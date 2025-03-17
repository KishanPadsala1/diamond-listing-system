import React, { useState, useEffect } from 'react';
import { Typography, Button, Divider, Card, Row, Col, Tabs, Alert } from 'antd';
import { ShoppingCartOutlined, MailOutlined, DownloadOutlined } from '@ant-design/icons';
import DiamondList from '../components/Diamonds/DiamondList';
import BrokerSelector from '../components/Transactions/BrokerSelector';
import SummaryMatrix from '../components/Transactions/SummaryMatrix';
import InvoicePreview from '../components/Transactions/InvoicePreview';
import { Broker, Diamond, SummaryMatrix as SummaryMatrixType } from '../types';
import { getBrokers, getDiamonds, createTransaction, getBroker } from '../services/api';
import { calculateSummaryMatrix } from '../utils/helpers';
import { downloadInvoice, sendInvoiceEmail, generateInvoiceNumber } from '../utils/invoiceUtils';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const { Title } = Typography;
const { TabPane } = Tabs;

const TransactionsPage: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [selectedDiamonds, setSelectedDiamonds] = useState<Diamond[]>([]);
  const [selectedDiamondIds, setSelectedDiamondIds] = useState<React.Key[]>([]);
  const [summaryMatrix, setSummaryMatrix] = useState<SummaryMatrixType | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [activeTab, setActiveTab] = useState('diamonds');
  const [emailConfigured, setEmailConfigured] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [brokersData, diamondsData] = await Promise.all([
        getBrokers(),
        getDiamonds(),
      ]);
      setBrokers(brokersData);
      setDiamonds(diamondsData);
      
      // Initialize summary matrix
      const matrix = calculateSummaryMatrix(diamondsData, []);
      setSummaryMatrix(matrix);
    } catch (error) {
      console.error('Error fetching data:', error);
      showErrorToast('Unable to load brokers and diamonds data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Check if EmailJS is configured
    if (!process.env.REACT_APP_EMAILJS_USER_ID || 
        !process.env.REACT_APP_EMAILJS_SERVICE_ID || 
        !process.env.REACT_APP_EMAILJS_TEMPLATE_ID) {
      setEmailConfigured(false);
    }
  }, []);

  const resetSelections = () => {
    setSelectedBroker(null);
    setSelectedDiamonds([]);
    setSelectedDiamondIds([]);
    if (diamonds.length > 0) {
      const matrix = calculateSummaryMatrix(diamonds, []);
      setSummaryMatrix(matrix);
    }
    setInvoiceNumber('');
    setInvoiceDate('');
  };

  const handleSelectBroker = async (brokerId: number) => {
    try {
      // If no broker ID is provided, reset all selections
      if (!brokerId) {
        resetSelections();
        return;
      }
      
      // If there's already a selected broker and it's different from the new one,
      // clear the selected diamonds
      if (selectedBroker && selectedBroker.id !== brokerId) {
        setSelectedDiamonds([]);
        setSelectedDiamondIds([]);
        const matrix = calculateSummaryMatrix(diamonds, []);
        setSummaryMatrix(matrix);
      }
      
      const broker = await getBroker(brokerId);
      setSelectedBroker(broker);
    } catch (error) {
      console.error('Error fetching broker details:', error);
      showErrorToast('Failed to fetch broker details. Please try selecting a different broker.');
    }
  };

  const handleSelectDiamonds = (selectedRowKeys: React.Key[], selectedRows: Diamond[]) => {
    setSelectedDiamonds(selectedRows);
    setSelectedDiamondIds(selectedRowKeys);
    
    if (diamonds.length > 0) {
      const matrix = calculateSummaryMatrix(diamonds, selectedRows);
      setSummaryMatrix(matrix);
    }
  };

  const handlePurchase = async () => {
    if (!selectedBroker) {
      showErrorToast('Please select a broker before proceeding with the purchase.');
      return;
    }

    if (selectedDiamonds.length === 0) {
      showErrorToast('Please select at least one diamond for the transaction.');
      return;
    }

    setSubmitting(true);
    try {
      const totalAmount = selectedDiamonds.reduce(
        (sum, diamond) => sum + diamond.totalAmount,
        0
      );

      // Generate invoice number and date
      const newInvoiceNumber = generateInvoiceNumber();
      const newInvoiceDate = new Date().toISOString();
      
      setInvoiceNumber(newInvoiceNumber);
      setInvoiceDate(newInvoiceDate);

      await createTransaction({
        brokerId: selectedBroker.id,
        date: newInvoiceDate,
        diamonds: selectedDiamonds.map((diamond) => diamond.id),
        totalAmount,
      });

      showSuccessToast(`Transaction with ${selectedDiamonds.length} diamonds for ${selectedBroker.name} has been created successfully.`);
      
      // Directly show the invoice preview tab instead of the dialog
      setActiveTab('preview');
      
      // Reset diamond selection after successful purchase
      // We don't reset the selectedDiamonds here because we need them for the invoice preview
      // They will be reset when the user sends the email or selects a different broker
    } catch (error) {
      console.error('Error creating transaction:', error);
      showErrorToast('An error occurred while creating the transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!selectedBroker || selectedDiamonds.length === 0 || !invoiceNumber || !invoiceDate) {
      showErrorToast('Please ensure all invoice data is complete before downloading.');
      return;
    }

    try {
      downloadInvoice({
        broker: selectedBroker,
        diamonds: selectedDiamonds,
        totalAmount: calculateTotal(),
        invoiceNumber,
        date: invoiceDate,
      });

      showSuccessToast(`Invoice ${invoiceNumber} has been downloaded successfully.`);
    } catch (error) {
      showErrorToast('An error occurred while generating the PDF.');
      console.error(error);
    }
  };

  const calculateTotal = () => {
    return selectedDiamonds.reduce((sum, diamond) => sum + diamond.totalAmount, 0);
  };

  const handleSendInvoice = async () => {
    if (!emailConfigured) {
      showErrorToast('Please set up EmailJS environment variables to enable email functionality.');
      return;
    }

    if (!selectedBroker || selectedDiamonds.length === 0 || !invoiceNumber || !invoiceDate) {
      showErrorToast('Please ensure all invoice data is complete before sending.');
      return;
    }

    setSendingEmail(true);

    try {
      const invoiceData = {
        broker: selectedBroker,
        diamonds: selectedDiamonds,
        totalAmount: calculateTotal(),
        date: invoiceDate,
        invoiceNumber: invoiceNumber,
      };

      const result = await sendInvoiceEmail(invoiceData);
      
      if (result.success) {
        showSuccessToast(`Invoice has been sent to ${selectedBroker.name} at ${selectedBroker.email}`);
        
        // Reset selection
        resetSelections();
        setActiveTab('diamonds');
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      showErrorToast('An unexpected error occurred while sending the email.');
      console.error(error);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div>
      {!emailConfigured && (
        <Alert
          message="Email Configuration Missing"
          description="EmailJS configuration is missing. Please set the REACT_APP_EMAILJS_USER_ID, REACT_APP_EMAILJS_SERVICE_ID, and REACT_APP_EMAILJS_TEMPLATE_ID environment variables to enable email functionality."
          type="warning"
          showIcon
          className="mb-4"
          closable
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Transaction Management</Title>
      </div>

      <Divider />

      <Row gutter={24}>
        <Col span={8}>
          <Card title="Broker Selection" className="mb-6">
            <BrokerSelector
              brokers={brokers}
              selectedBroker={selectedBroker}
              onSelectBroker={handleSelectBroker}
              loading={loading}
            />
          </Card>

          {summaryMatrix && (
            <Card title="Summary Matrix" className="mb-6">
              <SummaryMatrix data={summaryMatrix} />
            </Card>
          )}

          <div className="flex mt-4">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={handlePurchase}
              loading={submitting}
              disabled={!selectedBroker || selectedDiamonds.length === 0}
              style={{ flex: 3, marginRight: 16 }}
            >
              Purchase Diamonds
            </Button>
            
            <Button
              type="default"
              size="large"
              onClick={resetSelections}
              disabled={!selectedBroker && selectedDiamonds.length === 0}
              style={{ flex: 1 }}
            >
              Reset
            </Button>
          </div>
        </Col>
        
        <Col span={16}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Diamond Selection" key="diamonds">
              <Card title="Diamond Selection">
                <DiamondList
                  diamonds={diamonds}
                  loading={loading}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onSelect={handleSelectDiamonds}
                  selectable={true}
                  selectedRowKeys={selectedDiamondIds}
                />
              </Card>
            </TabPane>
            
            {invoiceNumber && invoiceDate && selectedBroker && (
              <TabPane tab="Invoice Preview" key="preview">
                <Card 
                  title="Invoice Preview" 
                  extra={
                    <div className="space-x-2">
                      <Button 
                        type="primary" 
                        icon={<DownloadOutlined />} 
                        onClick={handleDownloadInvoice}
                      >
                        Download PDF
                      </Button>
                      <Button 
                        type="primary" 
                        icon={<MailOutlined />} 
                        onClick={handleSendInvoice}
                        loading={sendingEmail}
                        disabled={!emailConfigured}
                      >
                        Send to Broker
                      </Button>
                    </div>
                  }
                >
                  {selectedBroker && invoiceNumber && invoiceDate && (
                    <InvoicePreview
                      broker={selectedBroker}
                      diamonds={selectedDiamonds}
                      totalAmount={calculateTotal()}
                      invoiceNumber={invoiceNumber}
                      date={invoiceDate}
                    />
                  )}
                </Card>
              </TabPane>
            )}
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default TransactionsPage; 