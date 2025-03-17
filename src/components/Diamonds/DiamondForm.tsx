import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import { Diamond } from '../../types';
import { calculatePPC, calculateTotalAmount, generateStockNo } from '../../utils/helpers';

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
    >
      <Form.Item
        name="stockNo"
        label="Stock No"
        rules={[{ required: true, message: 'Stock number is required' }]}
      >
        <Input disabled={!!initialValues} placeholder="Auto-generated" />
      </Form.Item>

      <Form.Item
        name="carat"
        label="Carat"
        rules={[{ required: true, message: 'Carat is required' }]}
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
      >
        <Select placeholder="Select diamond shape">
          <Select.Option value="Round">Round</Select.Option>
          <Select.Option value="Princess">Princess</Select.Option>
          <Select.Option value="Cushion">Cushion</Select.Option>
          <Select.Option value="Emerald">Emerald</Select.Option>
          <Select.Option value="Oval">Oval</Select.Option>
          <Select.Option value="Radiant">Radiant</Select.Option>
          <Select.Option value="Pear">Pear</Select.Option>
          <Select.Option value="Heart">Heart</Select.Option>
          <Select.Option value="Marquise">Marquise</Select.Option>
          <Select.Option value="Asscher">Asscher</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="color"
        label="Color"
        rules={[{ required: true, message: 'Color is required' }]}
      >
        <Select placeholder="Select diamond color">
          <Select.Option value="D">D</Select.Option>
          <Select.Option value="E">E</Select.Option>
          <Select.Option value="F">F</Select.Option>
          <Select.Option value="G">G</Select.Option>
          <Select.Option value="H">H</Select.Option>
          <Select.Option value="I">I</Select.Option>
          <Select.Option value="J">J</Select.Option>
          <Select.Option value="K">K</Select.Option>
          <Select.Option value="L">L</Select.Option>
          <Select.Option value="M">M</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="clarity"
        label="Clarity"
        rules={[{ required: true, message: 'Clarity is required' }]}
      >
        <Select placeholder="Select diamond clarity">
          <Select.Option value="FL">FL</Select.Option>
          <Select.Option value="IF">IF</Select.Option>
          <Select.Option value="VVS1">VVS1</Select.Option>
          <Select.Option value="VVS2">VVS2</Select.Option>
          <Select.Option value="VS1">VS1</Select.Option>
          <Select.Option value="VS2">VS2</Select.Option>
          <Select.Option value="SI1">SI1</Select.Option>
          <Select.Option value="SI2">SI2</Select.Option>
          <Select.Option value="I1">I1</Select.Option>
          <Select.Option value="I2">I2</Select.Option>
          <Select.Option value="I3">I3</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="rapPrice"
        label="RAP Price"
        rules={[{ required: true, message: 'RAP Price is required' }]}
      >
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          placeholder="Enter RAP price"
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0 as any}
        />
      </Form.Item>

      <Form.Item
        name="discount"
        label="Discount %"
        rules={[{ required: true, message: 'Discount is required' }]}
      >
        <InputNumber
          max={0}
          style={{ width: '100%' }}
          placeholder="Enter discount percentage (negative)"
          formatter={(value) => `${value}%`}
          parser={(value) => value ? parseFloat(value.replace('%', '')) : 0 as any}
        />
      </Form.Item>

      <Form.Item
        name="ppc"
        label="PPC (Price Per Carat)"
      >
        <InputNumber
          disabled
          style={{ width: '100%' }}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
        />
      </Form.Item>

      <Form.Item
        name="totalAmount"
        label="Total Amount"
      >
        <InputNumber
          disabled
          style={{ width: '100%' }}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues ? 'Update Diamond' : 'Add Diamond'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiamondForm; 