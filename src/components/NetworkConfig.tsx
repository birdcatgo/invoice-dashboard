'use client'
import React, { useState } from 'react';
import { NetworkPaymentTerms } from '@/lib/types';

interface NetworkConfigProps {
  networkTerms: NetworkPaymentTerms[];
  onUpdate: (network: NetworkPaymentTerms) => void;
  onAdd: (network: NetworkPaymentTerms) => void;
}

export default function NetworkConfiguration({ networkTerms, onUpdate, onAdd }: NetworkConfigProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newNetwork, setNewNetwork] = useState<NetworkPaymentTerms>({
    name: '',
    netTerms: 30,
    payPeriod: 'weekly',
    otherBusinessNames: ''
  });

  const NetworkForm = ({ network, onSave, onCancel }: {
    network: NetworkPaymentTerms;
    onSave: (network: NetworkPaymentTerms) => void;
    onCancel: () => void;
  }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Network Name</label>
        <input
          type="text"
          value={network.name}
          onChange={(e) => network.name = e.target.value}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Terms (days)</label>
        <input
          type="number"
          value={network.netTerms}
          onChange={(e) => network.netTerms = parseInt(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Payment Period</label>
        <select
          value={network.payPeriod}
          onChange={(e) => network.payPeriod = e.target.value as 'weekly' | 'monthly'}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Other Business Names</label>
        <input
          type="text"
          value={network.otherBusinessNames || ''}
          onChange={(e) => network.otherBusinessNames = e.target.value}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">Separate multiple names with commas</p>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(network)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Network Settings</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Network
        </button>
      </div>

      <div className="space-y-4">
        {networkTerms.map((network) => (
          <div key={network.name} className="border rounded-lg p-4">
            {editingId === network.name ? (
              <NetworkForm
                network={{ ...network }}
                onSave={(updated) => {
                  onUpdate(updated);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{network.name}</h3>
                  <p className="text-sm text-gray-600">Net {network.netTerms} {network.payPeriod}</p>
                  {network.otherBusinessNames && (
                    <p className="text-sm text-gray-500">Also known as: {network.otherBusinessNames}</p>
                  )}
                </div>
                <button
                  onClick={() => setEditingId(network.name)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}

        {isAddingNew && (
          <div className="border rounded-lg p-4">
            <NetworkForm
              network={newNetwork}
              onSave={(network) => {
                onAdd(network);
                setIsAddingNew(false);
                setNewNetwork({
                  name: '',
                  netTerms: 30,
                  payPeriod: 'weekly',
                  otherBusinessNames: ''
                });
              }}
              onCancel={() => setIsAddingNew(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}