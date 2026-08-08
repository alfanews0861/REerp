import React from 'react';

export const CommissionRulesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Commission Rules Configurator</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600 mb-4">Configure enterprise commission policies by hierarchy level, project, or specific member.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">Add New Rule</button>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Position / Member</th>
              <th className="border-b p-2">Project</th>
              <th className="border-b p-2">Type</th>
              <th className="border-b p-2">Value</th>
              <th className="border-b p-2">Status</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b p-2">Senior General Manager</td>
              <td className="border-b p-2">All</td>
              <td className="border-b p-2">PERCENTAGE</td>
              <td className="border-b p-2">1.5%</td>
              <td className="border-b p-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </td>
              <td className="border-b p-2">
                <button className="text-blue-500 hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionRulesPage;
