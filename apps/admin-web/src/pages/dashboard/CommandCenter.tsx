import React, { useState, useEffect } from 'react';
import { DashboardService } from '../../services/DashboardService';
import { ExecutiveDashboardData } from '@real-estate-erp/types';

export const CommandCenter: React.FC = () => {
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'MARKETING' | 'SALES' | 'INVENTORY' | 'AFTER_SALES' | 'AI_INSIGHTS'>('SALES');

  useEffect(() => {
    DashboardService.getCommandCenterData().then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading Command Center...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Management Command Center</h1>
        <div className="flex space-x-2">
          {/* Filters would go here */}
          <select className="border rounded p-2"><option>All Projects</option></select>
          <select className="border rounded p-2"><option>This Month</option></select>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          {['MARKETING', 'SALES', 'INVENTORY', 'AFTER_SALES', 'AI_INSIGHTS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{data.kpis.bookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Gross Sales</p>
          <p className="text-2xl font-bold">₹ {(data.kpis.grossSales / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Collected Amount</p>
          <p className="text-2xl font-bold">₹ {(data.kpis.collectedAmount / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Open After-Sales Cases</p>
          <p className="text-2xl font-bold">{data.kpis.afterSalesOpenCases}</p>
        </div>
      </div>

      {activeTab === 'AI_INSIGHTS' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">AI Analytics & Signals</h2>
          {data.insights.map((insight, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{insight.metric}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  insight.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {insight.severity} SEVERITY
                </span>
              </div>
              <p className="text-gray-800 mb-1"><strong>Observation:</strong> {insight.observation}</p>
              <p className="text-gray-600 mb-1 text-sm"><strong>Evidence:</strong> {insight.evidence}</p>
              <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                <p><strong>Possible Cause:</strong> {insight.possibleCause}</p>
                <p className="mt-1 text-blue-700"><strong>Action:</strong> {insight.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab !== 'AI_INSIGHTS' && (
        <div className="bg-white p-6 rounded-lg shadow min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Drill-down charts and tables for {activeTab} will appear here.</p>
        </div>
      )}
    </div>
  );
};
