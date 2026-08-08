import React, { useState } from 'react';

export const TelecallerWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Telecaller Workspace</h1>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button 
            className={`px-4 py-3 font-medium ${activeTab === 'my_leads' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('my_leads')}
          >
            My Leads
          </button>
          <button 
            className={`px-4 py-3 font-medium ${activeTab === 'new' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('new')}
          >
            New Leads
          </button>
          <button 
            className={`px-4 py-3 font-medium ${activeTab === 'follow_up' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('follow_up')}
          >
            Follow-up Today
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Lead Name</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Contact</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Source</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Interest</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Status</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border-b p-3">John Doe</td>
              <td className="border-b p-3">+91 9876543210</td>
              <td className="border-b p-3">Facebook Ads</td>
              <td className="border-b p-3">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">MEDIUM</span>
              </td>
              <td className="border-b p-3">NEW</td>
              <td className="border-b p-3 space-x-2">
                <button className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Call</button>
                <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Qualify</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border-b p-3">Jane Smith</td>
              <td className="border-b p-3">+91 9123456780</td>
              <td className="border-b p-3">Walk In</td>
              <td className="border-b p-3">
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">HIGH</span>
              </td>
              <td className="border-b p-3">FOLLOW UP</td>
              <td className="border-b p-3 space-x-2">
                <button className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Call</button>
                <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Qualify</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TelecallerWorkspace;
