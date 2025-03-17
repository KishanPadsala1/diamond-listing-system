import React from 'react';
import { Card, Descriptions, Table, Typography, Divider } from 'antd';
import { Broker, Diamond } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/helpers';

const { Title, Text } = Typography;

interface InvoicePreviewProps {
  broker: Broker;
  diamonds: Diamond[];
  totalAmount: number;
  invoiceNumber: string;
  date: string;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  broker,
  diamonds,
  totalAmount,
  invoiceNumber,
  date,
}) => {
  const columns = [
    {
      title: 'Stock No',
      dataIndex: 'stockNo',
      key: 'stockNo',
    },
    {
      title: 'Carat',
      dataIndex: 'carat',
      key: 'carat',
      render: (carat: number) => carat.toFixed(2),
    },
    {
      title: 'Shape',
      dataIndex: 'shape',
      key: 'shape',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Clarity',
      dataIndex: 'clarity',
      key: 'clarity',
    },
    {
      title: 'RAP Price',
      dataIndex: 'rapPrice',
      key: 'rapPrice',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => formatPercentage(discount),
    },
    {
      title: 'PPC',
      dataIndex: 'ppc',
      key: 'ppc',
      render: (ppc: number) => formatCurrency(ppc),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
    },
  ];

  const totalCarat = diamonds.reduce((sum, diamond) => sum + diamond.carat, 0);

  return (
    <Card className="invoice-preview">
      <div className="text-center mb-4">
        <Title level={3}>Diamond Listing System</Title>
        <Title level={4}>INVOICE</Title>
        <Text>Invoice Number: {invoiceNumber}</Text>
        <br />
        <Text>Date: {new Date(date).toLocaleDateString()}</Text>
      </div>

      <Divider />

      <Title level={5}>Broker Details</Title>
      <Descriptions bordered size="small" column={1} className="mb-4">
        <Descriptions.Item label="Name">{broker.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{broker.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{broker.phone}</Descriptions.Item>
        <Descriptions.Item label="Address">{broker.address}</Descriptions.Item>
        <Descriptions.Item label="Broker Rate">{broker.brokerRate}%</Descriptions.Item>
      </Descriptions>

      <Title level={5}>Diamond Details</Title>
      <Table
        columns={columns}
        dataSource={diamonds.map((diamond, index) => ({ ...diamond, key: index }))}
        pagination={false}
        size="small"
        scroll={{ x: 'max-content' }}
      />

      <div className="text-right mt-4">
        <Text strong>Total Diamonds: {diamonds.length}</Text>
        <br />
        <Text strong>Total Carats: {totalCarat.toFixed(2)}</Text>
        <br />
        <Title level={4}>Total Amount: {formatCurrency(totalAmount)}</Title>
      </div>

      <Divider />

      <div className="text-center">
        <Text>Thank you for your business!</Text>
        <br />
        <Text type="secondary">Diamond Listing System Inc.</Text>
      </div>
    </Card>
  );
};

export default InvoicePreview; 