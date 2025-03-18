import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Diamond } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/helpers';
import { ColumnsType } from 'antd/es/table';
import { getShapeFilters, getColorFilters, getClarityFilters } from '../../constants/diamondLabels';

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
      filters: getShapeFilters(),
      onFilter: (value: any, record: Diamond) => record.shape === value,
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => <Tag color="blue">{color}</Tag>,
      filters: getColorFilters(),
      onFilter: (value: any, record: Diamond) => record.color === value,
    },
    {
      title: 'Clarity',
      dataIndex: 'clarity',
      key: 'clarity',
      render: (clarity: string) => <Tag color="purple">{clarity}</Tag>,
      filters: getClarityFilters(),
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