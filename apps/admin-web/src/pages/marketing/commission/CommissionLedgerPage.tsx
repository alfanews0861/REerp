import React from 'react';

export const CommissionLedgerPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Commission Ledger</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600 mb-4">View and approve pending commissions triggered by fully paid bookings.</p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Booking ID</th>
              <th className="border-b p-2">Member</th>
              <th className="border-b p-2">Position</th>
              <th className="border-b p-2">Amount</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b p-2">BK-10293</td>
              <td className="border-b p-2">John Doe</td>
              <td className="border-b p-2">SM</td>
              <td className="border-b p-2">₹15,000</td>
              <td className="border-b p-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">PENDING</span>
              </td>
              <td className="border-b p-2">
                <button className="text-green-600 hover:underline mr-2">Approve</button>
                <button className="text-red-600 hover:underline">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionLedgerPage;
