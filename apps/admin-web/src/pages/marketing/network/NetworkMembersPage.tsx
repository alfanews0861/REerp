import React from 'react';

export const NetworkMembersPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Network Members</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600">Manage all marketing network members, assignments, and transfers.</p>
        <table className="w-full mt-4 text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Name</th>
              <th className="border-b p-2">Position</th>
              <th className="border-b p-2">Parent</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b p-2">John Doe</td>
              <td className="border-b p-2">SM</td>
              <td className="border-b p-2">GM A1</td>
              <td className="border-b p-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </td>
              <td className="border-b p-2">
                <button className="text-blue-500 hover:underline">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkMembersPage;
