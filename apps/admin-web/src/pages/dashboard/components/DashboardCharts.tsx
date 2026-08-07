import React from 'react';
import { Grid } from '@mui/material';
import { DashboardWidget } from '@real-estate-erp/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DashboardData } from '../services/mockDashboardService';

interface DashboardChartsProps {
  data: DashboardData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ data }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Lead Source - Pie Chart */}
      <Grid item xs={12} md={4}>
        <DashboardWidget title="Lead Source">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.leadSource}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {data.leadSource.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>
      </Grid>

      {/* Daily Leads - Bar Chart */}
      <Grid item xs={12} md={8}>
        <DashboardWidget title="Daily Leads">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.dailyLeads}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>
      </Grid>

      {/* Monthly Revenue - Line Chart */}
      <Grid item xs={12} md={8}>
        <DashboardWidget title="Monthly Revenue">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>
      </Grid>

      {/* Campaign Performance - Bar Chart */}
      <Grid item xs={12} md={4}>
        <DashboardWidget title="Campaign Performance">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.campaignPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#FFBB28" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>
      </Grid>

      {/* Weekly Sales - Bar Chart */}
      <Grid item xs={12} md={6}>
        <DashboardWidget title="Weekly Sales">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.weeklySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#00C49F" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>
      </Grid>

      {/* Booking Trend - Line Chart */}
      <Grid item xs={12} md={6}>
        <DashboardWidget title="Booking Trend">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data.bookingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#FF8042" name="Bookings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>
      </Grid>
    </Grid>
  );
};
