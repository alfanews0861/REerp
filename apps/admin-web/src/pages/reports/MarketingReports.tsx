import React from 'react';

export const MarketingReports: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketing & Campaign Reports</h1>
        <select className="border border-gray-300 rounded p-2 bg-white shadow-sm">
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Report 1 */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-600">
          <h3 className="font-bold text-lg mb-2">1. Leads by Source</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex justify-between"><span>Facebook Ads</span> <span>45%</span></li>
            <li className="flex justify-between"><span>Walk-in</span> <span>25%</span></li>
            <li className="flex justify-between"><span>Referral</span> <span>15%</span></li>
            <li className="flex justify-between"><span>Other</span> <span>15%</span></li>
          </ul>
        </div>

        {/* Report 2 */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-green-600">
          <h3 className="font-bold text-lg mb-2">11. Cost Per Lead</h3>
          <div className="flex items-center justify-center h-24">
            <span className="text-3xl font-bold text-gray-800">₹45.20</span>
          </div>
          <p className="text-xs text-center text-green-600">↓ 12% from last month</p>
        </div>

        {/* Report 3 */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-purple-600">
          <h3 className="font-bold text-lg mb-2">15. Telecaller Performance</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex justify-between font-medium"><span>Telecaller</span> <span>Contacts</span></li>
            <li className="flex justify-between"><span>Sarah Connor</span> <span>1,204</span></li>
            <li className="flex justify-between"><span>John Smith</span> <span>950</span></li>
            <li className="flex justify-between"><span>Mike Tyson</span> <span>840</span></li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Available Management Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600">
          <a href="#" className="hover:underline">1. Leads by source</a>
          <a href="#" className="hover:underline">2. Leads by campaign</a>
          <a href="#" className="hover:underline">3. Leads by project</a>
          <a href="#" className="hover:underline">4. Leads by executive</a>
          <a href="#" className="hover:underline">5. Leads by network member</a>
          <a href="#" className="hover:underline">6. Leads by telecaller</a>
          <a href="#" className="hover:underline">7. Site visits by source</a>
          <a href="#" className="hover:underline">8. Bookings by source</a>
          <a href="#" className="hover:underline">9. Registrations by source</a>
          <a href="#" className="hover:underline">10. Campaign conversion funnel</a>
          <a href="#" className="hover:underline">11. Cost per lead</a>
          <a href="#" className="hover:underline">12. Cost per booking</a>
          <a href="#" className="hover:underline">13. Revenue by campaign</a>
          <a href="#" className="hover:underline">14. Revenue by source</a>
          <a href="#" className="hover:underline">15. Telecaller performance</a>
          <a href="#" className="hover:underline">16. Executive conversion</a>
          <a href="#" className="hover:underline">17. Network conversion</a>
          <a href="#" className="hover:underline">18. Lead response time</a>
          <a href="#" className="hover:underline">19. Follow-up overdue</a>
          <a href="#" className="hover:underline">20. No-response leads</a>
          <a href="#" className="hover:underline">21. Duplicate leads analysis</a>
          <a href="#" className="hover:underline">22. Lead ownership transfers</a>
          <a href="#" className="hover:underline">23. Campaign ROI</a>
        </div>
      </div>
    </div>
  );
};

export default MarketingReports;
