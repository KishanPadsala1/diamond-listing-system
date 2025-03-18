import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Space } from 'antd';
import { Broker } from '../../types';

interface BrokerFormProps {
  initialValues?: Broker;
  onFinish: (values: Omit<Broker, 'id'>) => void;
  loading: boolean;
}

const BrokerForm: React.FC<BrokerFormProps> = ({
  initialValues,
  onFinish,
  loading,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || { isActive: true, brokerRate: 5.0 }}
      onFinish={onFinish}
      requiredMark="optional"
      validateTrigger={['onChange', 'onBlur']}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: 'Please enter broker name' },
          { min: 3, message: 'Name must be at least 3 characters' },
          { max: 50, message: 'Name cannot exceed 50 characters' },
          { pattern: /^[a-zA-Z\s.'-]+$/, message: 'Name can only contain letters, spaces, and basic punctuation' }
        ]}
        hasFeedback
      >
        <Input placeholder="Enter broker name" maxLength={50} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter a valid email' },
          { max: 100, message: 'Email cannot exceed 100 characters' }
        ]}
        hasFeedback
      >
        <Input placeholder="Enter email address" maxLength={100} />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone No"
        rules={[
          { required: true, message: 'Please enter phone number' },
          { pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im, message: 'Please enter a valid phone number' }
        ]}
        hasFeedback
      >
        <Input placeholder="Enter phone number (e.g., 123-456-7890)" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[
          { required: true, message: 'Please enter address' },
          { min: 5, message: 'Address must be at least 5 characters' },
          { max: 200, message: 'Address cannot exceed 200 characters' }
        ]}
        hasFeedback
      >
        <Input.TextArea 
          rows={3} 
          placeholder="Enter complete address"
          maxLength={200}
          showCount
        />
      </Form.Item>

      <Form.Item
        name="brokerRate"
        label="Broker Rate (%)"
        rules={[
          {
            validator: async (_, value) => {
              if (value === undefined || value === null || value === '') {
                throw new Error('Please enter broker rate');
              }
              if (typeof value !== 'number' && isNaN(Number(value))) {
                throw new Error('Please enter a valid number');
              }
              if (Number(value) < 0) {
                throw new Error('Rate cannot be negative');
              }
              if (Number(value) > 100) {
                throw new Error('Rate cannot exceed 100%');
              }
            },
          },
        ]}
        hasFeedback
      >
        <InputNumber
          min={0}
          max={100}
          step={0.1}
          precision={2}
          style={{ width: '100%' }}
          placeholder="Enter broker rate percentage"
          addonAfter="%"
        />
      </Form.Item>

      <Form.Item 
        name="isActive" 
        label="Status" 
        valuePropName="checked"
        tooltip="Active brokers are available for transactions"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button 
            onClick={() => form.resetFields()} 
            disabled={loading}
          >
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update Broker' : 'Add Broker'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default BrokerForm; 