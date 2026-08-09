import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Customer360Profile, CustomerTimelineItem } from '@real-estate-erp/types';
import { Customer360Service } from '../../services/Customer360Service';

export const Customer360View: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TIMELINE' | 'DOCUMENTS' | 'AFTER_SALES'>('PROFILE');
  const [profile, setProfile] = useState<Customer360Profile | null>(null);
  const [timeline, setTimeline] = useState<CustomerTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [prof, time] = await Promise.all([
          Customer360Service.getCustomerProfile(id),
          Customer360Service.getCustomerTimeline(id)
        ]);
        setProfile(prof);
        setTimeline(time);
      } catch (err) {
        console.error("Failed to load customer data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="p-6">Loading Customer 360...</div>;
  if (!profile) return <div className="p-6">Customer not found</div>;

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
                  <p className="font-medium">{profile.fullName || profile.displayName || 'Unknown Name'}</p>
                  <p>{profile.primaryMobile}</p>
                  <p>{profile.primaryEmail}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Financial Summary</p>
                  <p>Total Booked: ₹ {profile.financials?.totalBookedValue.toLocaleString() || 0}</p>
                  <p>Total Paid: ₹ {profile.financials?.totalAmountPaid.toLocaleString() || 0}</p>
                  <p>Balance Due: ₹ {profile.financials?.balanceDue.toLocaleString() || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded col-span-2">
                  <p className="text-sm text-gray-500">Activity Summary</p>
                  <div className="flex space-x-6 mt-2">
                    <div><span className="font-bold">{profile.summary?.totalLeads || 0}</span> Leads</div>
                    <div><span className="font-bold">{profile.summary?.totalSiteVisits || 0}</span> Site Visits</div>
                    <div><span className="font-bold">{profile.summary?.totalBookings || 0}</span> Bookings</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TIMELINE' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                {timeline.length === 0 ? (
                  <p className="text-gray-500">No timeline events found.</p>
                ) : (
                  timeline.map(item => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-blue-800">{item.type}</span>
                        <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="font-medium">{item.title}</p>
                      {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'DOCUMENTS' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Document Vault</h2>
              <p className="text-gray-500">Document viewer loaded here.</p>
            </div>
          )}

          {activeTab === 'AFTER_SALES' && (
            <div>
              <h2 className="text-lg font-medium mb-4">After-Sales Cases</h2>
              <p className="text-gray-500">After-Sales records loaded here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
