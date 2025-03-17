import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Divider, Tabs } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import DiamondList from '../components/Diamonds/DiamondList';
import DiamondForm from '../components/Diamonds/DiamondForm';
import ExcelUpload from '../components/Diamonds/ExcelUpload';
import { Diamond } from '../types';
import {
  getDiamonds,
  createDiamond,
  updateDiamond,
  deleteDiamond,
} from '../services/api';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const { Title } = Typography;
const { TabPane } = Tabs;

const DiamondsPage: React.FC = () => {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState<Diamond | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const fetchDiamonds = async () => {
    setLoading(true);
    try {
      const data = await getDiamonds();
      setDiamonds(data);
    } catch (error) {
      console.error('Error fetching diamonds:', error);
      showErrorToast('Failed to fetch diamonds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiamonds();
  }, []);

  const handleAddDiamond = () => {
    setEditingDiamond(null);
    setFormVisible(true);
  };

  const handleEditDiamond = (diamond: Diamond) => {
    setEditingDiamond(diamond);
    setFormVisible(true);
  };

  const handleDeleteDiamond = async (id: number) => {
    try {
      await deleteDiamond(id);
      showSuccessToast('Diamond deleted successfully');
      fetchDiamonds();
    } catch (error) {
      console.error('Error deleting diamond:', error);
      showErrorToast('Failed to delete diamond');
    }
  };

  const handleFormSubmit = async (values: Omit<Diamond, 'id'>) => {
    setSubmitting(true);
    try {
      if (editingDiamond) {
        await updateDiamond(editingDiamond.id, values);
        showSuccessToast('Diamond updated successfully');
      } else {
        await createDiamond(values);
        showSuccessToast('Diamond added successfully');
      }
      setFormVisible(false);
      fetchDiamonds();
    } catch (error) {
      console.error('Error saving diamond:', error);
      showErrorToast('Failed to save diamond');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (diamonds: Omit<Diamond, 'id'>[]) => {
    setSubmitting(true);
    try {
      const promises = diamonds.map((diamond) => createDiamond(diamond));
      await Promise.all(promises);
      showSuccessToast(`${diamonds.length} diamonds uploaded successfully`);
      fetchDiamonds();
      setActiveTab('list');
    } catch (error) {
      console.error('Error uploading diamonds:', error);
      showErrorToast('Failed to upload diamonds');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Diamond Management</Title>
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddDiamond}
          >
            Add Diamond
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setActiveTab('upload')}
          >
            Bulk Upload
          </Button>
        </div>
      </div>

      <Divider />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Diamond List" key="list">
          <DiamondList
            diamonds={diamonds}
            loading={loading}
            onEdit={handleEditDiamond}
            onDelete={handleDeleteDiamond}
          />
        </TabPane>
        <TabPane tab="Excel Upload" key="upload">
          <div className="p-6 bg-gray-50 rounded-lg">
            <Title level={4} className="mb-4">
              Upload Diamonds from Excel
            </Title>
            <p className="mb-4 text-gray-600">
              Upload an Excel file containing diamond details. The file should have
              columns for carat, shape, color, clarity, RAP price, and discount.
            </p>
            <ExcelUpload onUpload={handleBulkUpload} />
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title={editingDiamond ? 'Edit Diamond' : 'Add Diamond'}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <DiamondForm
          initialValues={editingDiamond || undefined}
          onFinish={handleFormSubmit}
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default DiamondsPage; 