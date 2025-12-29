
import React, { useState } from 'react';
import { SurgicalRecord, UserRole } from '../types';
import { Search, Filter, Eye, Printer, Trash2, Calendar } from 'lucide-react';

interface RecordSearchProps {
  records: SurgicalRecord[];
  onPreview: (record: SurgicalRecord) => void;
  userRole: UserRole;
}

const RecordSearch: React.FC<RecordSearchProps> = ({ records, onPreview, userRole }) => {
  const [query, setQuery] = useState('');

  const filtered = records.filter(r => 
    r.hospitalNumber.toLowerCase().includes(query.toLowerCase()) ||
    r.patientName.toLowerCase().includes(query.toLowerCase()) ||
    r.operativeProcedure.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Search Records</h2>
          <p className="text-slate-500">Query by HN, Patient Name or Procedure</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Search Hospital Records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">HN & Patient</th>
                <th className="px-6 py-4">Operative Procedure</th>
                <th className="px-6 py-4">Surgeon</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{r.patientName}</p>
                      <p className="text-xs text-blue-600 font-medium">HN: {r.hospitalNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                        {r.operativeProcedure}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{r.surgeon}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={14} />
                        {new Date(r.timestamp).toLocaleDateString('th-TH')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onPreview(r)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View & Print"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Quick Print"
                        >
                          <Printer size={18} />
                        </button>
                        {userRole === 'ADMIN' && (
                          <button
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <Search size={48} className="opacity-10 mb-2" />
                      <p>No matching records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordSearch;
