import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Customer360Profile } from '@real-estate-erp/types';

export const Customer360View: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TIMELINE' | 'DOCUMENTS' | 'AFTER_SALES'>('PROFILE');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer 360</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Customer ID: {id}
        </span>
      </div>

      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['PROFILE', 'TIMELINE', 'DOCUMENTS', 'AFTER_SALES'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'PROFILE' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Customer Profile</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Contact Details</p>
                  <p className="font-medium">Placeholder Name</p>
                  <p>+91 9876543210</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Financial Summary</p>
                  <p>Total Booked: ₹ 0</p>
                  <p>Total Paid: ₹ 0</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TIMELINE' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Activity Timeline</h2>
              <p className="text-gray-500">Chronological list of Interactions, Bookings, Payments, and After-Sales events.</p>
              {/* Timeline Component would go here */}
            </div>
          )}

          {activeTab === 'DOCUMENTS' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Document Vault</h2>
              <p className="text-gray-500">Management can upload documents with granular visibility (CUSTOMER_VISIBLE, MANAGEMENT_ONLY, etc.).</p>
              {/* Document List Component would go here */}
            </div>
          )}

          {activeTab === 'AFTER_SALES' && (
            <div>
              <h2 className="text-lg font-medium mb-4">After-Sales Cases</h2>
              <p className="text-gray-500">Manage registration delivery, possession info, and customer support.</p>
              {/* After-Sales Component would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
