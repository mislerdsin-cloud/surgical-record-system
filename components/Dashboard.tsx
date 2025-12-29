
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SurgicalRecord } from '../types';
import { Users, ClipboardList, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  records: SurgicalRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  // Aggregate data for the chart
  const procedureStats = records.reduce((acc: any, record) => {
    const procedure = record.operativeProcedure || 'Unknown';
    acc[procedure] = (acc[procedure] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(procedureStats).map(key => ({
    name: key,
    count: procedureStats[key],
  })).sort((a, b) => b.count - a.count).slice(0, 8);

  const stats = [
    { label: 'Total Patients', value: records.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Procedures Done', value: records.length, icon: ClipboardList, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'This Month', value: records.filter(r => new Date(r.timestamp).getMonth() === new Date().getMonth()).length, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Time (Min)', value: records.length > 0 ? '85' : '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Surgical Dashboard</h2>
        <p className="text-slate-500">Overview of clinical activities and procedures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Top Operative Procedures</h3>
        <div className="h-[400px]">
          {records.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 50, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <ClipboardList size={48} className="mb-2 opacity-20" />
              <p>No records found to display charts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
