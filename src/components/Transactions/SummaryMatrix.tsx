import React from 'react';
import { Table } from 'antd';
import { SummaryMatrix as SummaryMatrixType } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface SummaryMatrixProps {
  data: SummaryMatrixType;
}

const SummaryMatrix: React.FC<SummaryMatrixProps> = ({ data }) => {
  const columns = [
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Selected',
      dataIndex: 'selected',
      key: 'selected',
    },
    {
      title: 'Bill Amount',
      dataIndex: 'billAmount',
      key: 'billAmount',
    },
  ];

  const dataSource = [
    {
      key: 'qty',
      summary: 'Qty',
      total: data.qty.total,
      selected: data.qty.selected,
      billAmount: '-',
    },
    {
      key: 'totalCts',
      summary: 'Total Cts',
      total: data.totalCts.total.toFixed(2),
      selected: data.totalCts.selected.toFixed(2),
      billAmount: '-',
    },
    {
      key: 'avgDis',
      summary: 'Avg Dis',
      total: `$${data.avgDis.total.toFixed(2)}`,
      selected: `$${data.avgDis.selected.toFixed(2)}`,
      billAmount: '-',
    },
    {
      key: 'totalAmount',
      summary: 'Total Amount',
      total: formatCurrency(data.totalAmount.total),
      selected: formatCurrency(data.totalAmount.selected),
      billAmount: formatCurrency(data.totalAmount.billAmount),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
      size="middle"
      className="summary-matrix"
    />
  );
};

export default SummaryMatrix; 