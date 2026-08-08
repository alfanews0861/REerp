import React, { useState } from 'react';

export const CampaignList: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Create Campaign
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Active Campaigns</h3>
          <p className="text-2xl font-semibold">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Leads Generated</h3>
          <p className="text-2xl font-semibold">4,203</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Site Visits</h3>
          <p className="text-2xl font-semibold">892</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Campaign ROI</h3>
          <p className="text-2xl font-semibold text-green-600">324%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Campaign Name</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Channel</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Status</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Leads</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Spend</th>
              <th className="border-b p-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock Data */}
            <tr className="hover:bg-gray-50">
              <td className="border-b p-3">Summer Festive Offer</td>
              <td className="border-b p-3">Facebook Ads</td>
              <td className="border-b p-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </td>
              <td className="border-b p-3">1,240</td>
              <td className="border-b p-3">₹45,000</td>
              <td className="border-b p-3">
                <a href="/marketing/campaigns/details" className="text-blue-600 hover:underline">View</a>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border-b p-3">Website Organic</td>
              <td className="border-b p-3">WEBSITE</td>
              <td className="border-b p-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </td>
              <td className="border-b p-3">890</td>
              <td className="border-b p-3">₹0</td>
              <td className="border-b p-3">
                <a href="/marketing/campaigns/details" className="text-blue-600 hover:underline">View</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignList;
