import React, { useState } from 'react';
import { Upload, Button, message, Modal, Table } from 'antd';
import { UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import { Diamond } from '../../types';
import { parseExcelFile } from '../../utils/excelUtils';
import { formatCurrency, formatPercentage } from '../../utils/helpers';

interface ExcelUploadProps {
  onUpload: (diamonds: Omit<Diamond, 'id'>[]) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onUpload }) => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<Diamond[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleUpload = async () => {
    const file = fileList[0];
    if (!file) {
      message.error('Please select a file to upload');
      return;
    }

    setUploading(true);

    try {
      const diamonds = await parseExcelFile(file);
      setPreviewData(diamonds);
      setPreviewVisible(true);
      setUploading(false);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      message.error('Failed to parse Excel file. Please check the format.');
      setUploading(false);
    }
  };

  const handleConfirmUpload = () => {
    onUpload(previewData);
    setPreviewVisible(false);
    setFileList([]);
    message.success('Diamonds uploaded successfully');
  };

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
      title: 'Discount %',
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
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatCurrency(amount),
    },
  ];

  const props = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file: RcFile) => {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      
      if (!isExcel) {
        message.error('You can only upload Excel files!');
        return Upload.LIST_IGNORE;
      }
      
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="excel-upload">
      <Upload {...props} maxCount={1}>
        <Button icon={<UploadOutlined />}>Select Excel File</Button>
      </Upload>
      
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
        icon={<FileExcelOutlined />}
      >
        {uploading ? 'Processing' : 'Upload'}
      </Button>

      <Modal
        title="Preview Diamonds"
        open={previewVisible}
        onOk={handleConfirmUpload}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        okText="Confirm Upload"
        cancelText="Cancel"
      >
        <Table
          columns={columns}
          dataSource={previewData.map((item, index) => ({ ...item, key: index }))}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default ExcelUpload; 