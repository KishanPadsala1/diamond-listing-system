import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Diamond } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/helpers';
import { ColumnsType } from 'antd/es/table';

interface DiamondListProps {
  diamonds: Diamond[];
  loading: boolean;
  onEdit: (diamond: Diamond) => void;
  onDelete: (id: number) => void;
  onSelect?: (selectedRowKeys: React.Key[], selectedRows: Diamond[]) => void;
  selectable?: boolean;
  selectedRowKeys?: React.Key[];
}

const DiamondList: React.FC<DiamondListProps> = ({
  diamonds,
  loading,
  onEdit,
  onDelete,
  onSelect,
  selectable = false,
  selectedRowKeys = [],
}) => {
  const columns: ColumnsType<Diamond & { key: number }> = [
    {
      title: 'Stock No',
      dataIndex: 'stockNo',
      key: 'stockNo',
      sorter: (a: Diamond, b: Diamond) => a.stockNo.localeCompare(b.stockNo),
    },
    {
      title: 'Carat',
      dataIndex: 'carat',
      key: 'carat',
      sorter: (a: Diamond, b: Diamond) => a.carat - b.carat,
    },
    {
      title: 'Shape',
      dataIndex: 'shape',
      key: 'shape',
      filters: [
        { text: 'Round', value: 'Round' },
        { text: 'Princess', value: 'Princess' },
        { text: 'Cushion', value: 'Cushion' },
        { text: 'Emerald', value: 'Emerald' },
        { text: 'Oval', value: 'Oval' },
        { text: 'Radiant', value: 'Radiant' },
        { text: 'Pear', value: 'Pear' },
        { text: 'Heart', value: 'Heart' },
        { text: 'Marquise', value: 'Marquise' },
        { text: 'Asscher', value: 'Asscher' },
      ],
      onFilter: (value: any, record: Diamond) => record.shape === value,
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => <Tag color="blue">{color}</Tag>,
      filters: [
        { text: 'D', value: 'D' },
        { text: 'E', value: 'E' },
        { text: 'F', value: 'F' },
        { text: 'G', value: 'G' },
        { text: 'H', value: 'H' },
        { text: 'I', value: 'I' },
        { text: 'J', value: 'J' },
        { text: 'K', value: 'K' },
        { text: 'L', value: 'L' },
        { text: 'M', value: 'M' },
      ],
      onFilter: (value: any, record: Diamond) => record.color === value,
    },
    {
      title: 'Clarity',
      dataIndex: 'clarity',
      key: 'clarity',
      render: (clarity: string) => <Tag color="purple">{clarity}</Tag>,
      filters: [
        { text: 'FL', value: 'FL' },
        { text: 'IF', value: 'IF' },
        { text: 'VVS1', value: 'VVS1' },
        { text: 'VVS2', value: 'VVS2' },
        { text: 'VS1', value: 'VS1' },
        { text: 'VS2', value: 'VS2' },
        { text: 'SI1', value: 'SI1' },
        { text: 'SI2', value: 'SI2' },
        { text: 'I1', value: 'I1' },
        { text: 'I2', value: 'I2' },
        { text: 'I3', value: 'I3' },
      ],
      onFilter: (value: any, record: Diamond) => record.clarity === value,
    },
    {
      title: 'RAP Price',
      dataIndex: 'rapPrice',
      key: 'rapPrice',
      render: (price: number) => formatCurrency(price),
      sorter: (a: Diamond, b: Diamond) => a.rapPrice - b.rapPrice,
    },
    {
      title: 'Discount %',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => (
        <Tag color="red">{formatPercentage(discount)}</Tag>
      ),
      sorter: (a: Diamond, b: Diamond) => a.discount - b.discount,
    },
    {
      title: 'PPC',
      dataIndex: 'ppc',
      key: 'ppc',
      render: (ppc: number) => formatCurrency(ppc),
      sorter: (a: Diamond, b: Diamond) => a.ppc - b.ppc,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: Diamond, b: Diamond) => a.totalAmount - b.totalAmount,
    },
  ];

  if (!selectable) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Diamond) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this diamond?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={diamonds.map(diamond => ({ ...diamond, key: diamond.id }))}
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 'max-content' }}
      rowSelection={
        selectable && onSelect
          ? {
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                onSelect(selectedRowKeys, selectedRows);
              },
              selectedRowKeys: selectedRowKeys,
            }
          : undefined
      }
    />
  );
};

export default DiamondList; 