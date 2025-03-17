import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BrokerList from '../components/Brokers/BrokerList';
import BrokerForm from '../components/Brokers/BrokerForm';
import { Broker } from '../types';
import {
  getBrokers,
  createBroker,
  updateBroker,
  deleteBroker,
} from '../services/api';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';

const { Title } = Typography;

const BrokersPage: React.FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBrokers = async () => {
    setLoading(true);
    try {
      const data = await getBrokers();
      setBrokers(data);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      showErrorToast('Failed to fetch brokers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleAddBroker = () => {
    setEditingBroker(null);
    setFormVisible(true);
  };

  const handleEditBroker = (broker: Broker) => {
    setEditingBroker(broker);
    setFormVisible(true);
  };

  const handleDeleteBroker = async (id: number) => {
    try {
      await deleteBroker(id);
      showSuccessToast('Broker deleted successfully');
      fetchBrokers();
    } catch (error) {
      console.error('Error deleting broker:', error);
      showErrorToast('Failed to delete broker');
    }
  };

  const handleFormSubmit = async (values: Omit<Broker, 'id'>) => {
    setSubmitting(true);
    try {
      if (editingBroker) {
        await updateBroker(editingBroker.id, values);
        showSuccessToast('Broker updated successfully');
      } else {
        await createBroker(values);
        showSuccessToast('Broker added successfully');
      }
      setFormVisible(false);
      fetchBrokers();
    } catch (error) {
      console.error('Error saving broker:', error);
      showErrorToast('Failed to save broker');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Broker Management</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddBroker}
        >
          Add Broker
        </Button>
      </div>

      <Divider />

      <BrokerList
        brokers={brokers}
        loading={loading}
        onEdit={handleEditBroker}
        onDelete={handleDeleteBroker}
      />

      <Modal
        title={editingBroker ? 'Edit Broker' : 'Add Broker'}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        destroyOnClose
      >
        <BrokerForm
          initialValues={editingBroker || undefined}
          onFinish={handleFormSubmit}
          loading={submitting}
        />
      </Modal>
    </div>
  );
};

export default BrokersPage; 