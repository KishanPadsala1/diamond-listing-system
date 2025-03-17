import React from 'react';
import { Form, Input, InputNumber, Switch, Button } from 'antd';
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
      initialValues={initialValues || { isActive: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter broker name' }]}
      >
        <Input placeholder="Enter broker name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone No"
        rules={[{ required: true, message: 'Please enter phone number' }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input.TextArea rows={3} placeholder="Enter address" />
      </Form.Item>

      <Form.Item
        name="brokerRate"
        label="Broker Rate (%)"
        rules={[{ required: true, message: 'Please enter broker rate' }]}
      >
        <InputNumber
          min={0}
          max={100}
          step={0.1}
          precision={2}
          style={{ width: '100%' }}
          placeholder="Enter broker rate"
        />
      </Form.Item>

      <Form.Item name="isActive" label="Status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues ? 'Update Broker' : 'Add Broker'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BrokerForm; 