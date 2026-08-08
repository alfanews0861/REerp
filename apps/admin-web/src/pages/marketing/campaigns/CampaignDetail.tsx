import React from 'react';

export const CampaignDetail: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Summer Festive Offer</h1>
          <p className="text-sm text-gray-500">Facebook Ads • Active</p>
        </div>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300">
          Edit Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Funnel Analytics</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Total Leads</span>
              <span className="font-bold">1,240</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Contacted</span>
              <span className="font-bold">980 <span className="text-xs text-green-500">(79%)</span></span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Interested / Qualified</span>
              <span className="font-bold">420 <span className="text-xs text-green-500">(42%)</span></span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Site Visits</span>
              <span className="font-bold">180 <span className="text-xs text-green-500">(42%)</span></span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-gray-600">Bookings</span>
              <span className="font-bold">35 <span className="text-xs text-green-500">(19%)</span></span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Financials & ROI</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Budget</span>
              <span className="font-bold">₹100,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Total Spend</span>
              <span className="font-bold">₹45,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Cost Per Lead (CPL)</span>
              <span className="font-bold">₹36.29</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Cost Per Booking</span>
              <span className="font-bold">₹1,285</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-gray-600">Estimated Revenue</span>
              <span className="font-bold text-green-600">₹45,000,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
