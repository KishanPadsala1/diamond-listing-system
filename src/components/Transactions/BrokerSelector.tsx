import React from 'react';
import { Select, Card, Descriptions } from 'antd';
import { Broker } from '../../types';

interface BrokerSelectorProps {
  brokers: Broker[];
  selectedBroker: Broker | null;
  onSelectBroker: (brokerId: number) => void;
  loading: boolean;
}

const BrokerSelector: React.FC<BrokerSelectorProps> = ({
  brokers,
  selectedBroker,
  onSelectBroker,
  loading,
}) => {
  const activeBrokers = brokers.filter((broker) => broker.isActive);

  return (
    <div className="broker-selector">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Broker:
        </label>
        <Select
          placeholder="Select a broker"
          style={{ width: '100%' }}
          loading={loading}
          value={selectedBroker?.id}
          onChange={onSelectBroker}
          optionFilterProp="children"
          showSearch
          allowClear
          filterOption={(input, option) =>
            (option?.label as string)
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          options={activeBrokers.map((broker) => ({
            value: broker.id,
            label: broker.name,
          }))}
        />
      </div>

      {selectedBroker && (
        <Card title="Broker Details" className="mt-4">
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Name">{selectedBroker.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedBroker.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedBroker.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{selectedBroker.address}</Descriptions.Item>
            <Descriptions.Item label="Broker Rate">{selectedBroker.brokerRate}%</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default BrokerSelector; 