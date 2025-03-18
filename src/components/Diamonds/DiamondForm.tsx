import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Space, Divider } from 'antd';
import { Diamond } from '../../types';
import { calculatePPC, calculateTotalAmount, generateStockNo } from '../../utils/helpers';
import { InfoCircleOutlined } from '@ant-design/icons';
import { SHAPE_LABELS, COLOR_LABELS, CLARITY_LABELS } from '../../constants/diamondLabels';

interface DiamondFormProps {
  initialValues?: Diamond;
  onFinish: (values: Omit<Diamond, 'id'>) => void;
  loading: boolean;
}

const DiamondForm: React.FC<DiamondFormProps> = ({
  initialValues,
  onFinish,
  loading,
}) => {
  const [form] = Form.useForm();

  // Generate a stock number for new diamonds
  useEffect(() => {
    if (!initialValues) {
      form.setFieldsValue({
        stockNo: generateStockNo(),
      });
    }
  }, [form, initialValues]);

  // Calculate PPC and Total Amount when RAP Price or Discount changes
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if ('rapPrice' in changedValues || 'discount' in changedValues || 'carat' in changedValues) {
      const { rapPrice, discount, carat } = allValues;
      
      if (rapPrice && discount) {
        const ppc = calculatePPC(rapPrice, discount);
        form.setFieldsValue({ ppc });
        
        if (carat) {
          const totalAmount = calculateTotalAmount(ppc, carat);
          form.setFieldsValue({ totalAmount });
        }
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      onValuesChange={handleValuesChange}
      requiredMark="optional"
      validateTrigger={['onChange', 'onBlur']}
    >
      <Divider orientation="left">Basic Information</Divider>
      
      <Form.Item
        name="stockNo"
        label="Stock No"
        rules={[
          { required: true, message: 'Stock number is required' },
          { pattern: /^[A-Za-z0-9-]+$/, message: 'Stock number can only contain letters, numbers, and hyphens' }
        ]}
        tooltip={{ 
          title: 'Unique identifier for this diamond', 
          icon: <InfoCircleOutlined /> 
        }}
        hasFeedback
      >
        <Input 
          disabled={!!initialValues} 
          placeholder="Auto-generated" 
          maxLength={20}
        />
      </Form.Item>

      <Form.Item
        name="carat"
        label="Carat"
        rules={[
          {
            validator: async (_, value) => {
              if (value === undefined || value === null || value === '') {
                throw new Error('Carat is required');
              }
              if (typeof value !== 'number' && isNaN(Number(value))) {
                throw new Error('Please enter a valid number');
              }
              if (Number(value) < 0.01) {
                throw new Error('Carat must be at least 0.01');
              }
              if (Number(value) > 100) {
                throw new Error('Carat cannot exceed 100');
              }
            },
          },
        ]}
        tooltip="Weight of the diamond in carats"
        hasFeedback
      >
        <InputNumber
          min={0.01}
          step={0.01}
          precision={2}
          style={{ width: '100%' }}
          placeholder="Enter carat weight"
        />
      </Form.Item>

      <Form.Item
        name="shape"
        label="Shape"
        rules={[{ required: true, message: 'Shape is required' }]}
        hasFeedback
      >
        <Select placeholder="Select diamond shape">
          {Object.entries(SHAPE_LABELS).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Divider orientation="left">Quality</Divider>

      <Form.Item
        name="color"
        label="Color"
        rules={[{ required: true, message: 'Color is required' }]}
        tooltip="Color grade from D (colorless) to Z (light yellow)"
        hasFeedback
      >
        <Select placeholder="Select diamond color">
          {Object.entries(COLOR_LABELS).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="clarity"
        label="Clarity"
        rules={[{ required: true, message: 'Clarity is required' }]}
        tooltip="Clarity grade indicating the presence of inclusions"
        hasFeedback
      >
        <Select placeholder="Select diamond clarity">
          {Object.entries(CLARITY_LABELS).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Divider orientation="left">Pricing</Divider>

      <Form.Item
        name="rapPrice"
        label="RAP Price"
        rules={[
          {
            validator: async (_, value) => {
              if (value === undefined || value === null || value === '') {
                throw new Error('RAP Price is required');
              }
              if (typeof value !== 'number' && isNaN(Number(value))) {
                throw new Error('Please enter a valid number');
              }
              if (Number(value) < 1) {
                throw new Error('RAP Price must be at least 1');
              }
            },
          },
        ]}
        tooltip="Rapaport Price - the benchmark price for diamonds"
        hasFeedback
      >
        <InputNumber
          min={1}
          style={{ width: '100%' }}
          placeholder="Enter RAP price"
          prefix="$"
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>

      <Form.Item
        name="discount"
        label="Discount %"
        rules={[
          {
            validator: async (_, value) => {
              if (value === undefined || value === null || value === '') {
                throw new Error('Discount is required');
              }
              if (typeof value !== 'number' && isNaN(Number(value))) {
                throw new Error('Please enter a valid number');
              }
              if (Number(value) < -100) {
                throw new Error('Discount cannot exceed -100%');
              }
              if (Number(value) > 0) {
                throw new Error('Discount must be negative or zero');
              }
            },
          },
        ]}
        tooltip="Discount from RAP Price (negative percentage)"
        hasFeedback
      >
        <InputNumber
          max={0}
          style={{ width: '100%' }}
          placeholder="Enter discount percentage (negative)"
          addonAfter="%"
        />
      </Form.Item>

      <Form.Item
        name="ppc"
        label="PPC (Price Per Carat)"
        tooltip="Price per carat (calculated automatically)"
      >
        <InputNumber
          disabled
          style={{ width: '100%' }}
          prefix="$"
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>

      <Form.Item
        name="totalAmount"
        label="Total Amount"
        tooltip="Total price (calculated automatically)"
      >
        <InputNumber
          disabled
          style={{ width: '100%' }}
          prefix="$"
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
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
            {initialValues ? 'Update Diamond' : 'Add Diamond'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DiamondForm; 