
import React, { useState, useEffect } from 'react';
import { User, UserRole, SurgicalRecord } from './types';
import { DEFAULT_ADMINS } from './constants';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SurgicalForm from './components/SurgicalForm';
import RecordSearch from './components/RecordSearch';
import PrintPreview from './components/PrintPreview';
import { LayoutDashboard, FileText, Search, LogOut, UserCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'search' | 'preview'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<SurgicalRecord | null>(null);
  const [records, setRecords] = useState<SurgicalRecord[]>([]);

  useEffect(() => {
    const savedRecords = localStorage.getItem('surgical_records');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
    const session = localStorage.getItem('user_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  const handleLogin = (email: string) => {
    let role: UserRole = 'VIEWER';
    if (DEFAULT_ADMINS.includes(email.toLowerCase())) {
      role = 'ADMIN';
    } else if (email.includes('@hospital.com') || email.includes('@gmail.com')) {
      role = 'USER';
    }

    const user: User = { email, role, name: email.split('@')[0] };
    setCurrentUser(user);
    localStorage.setItem('user_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user_session');
  };

  const addRecord = (record: SurgicalRecord) => {
    const updatedRecords = [record, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('surgical_records', JSON.stringify(updatedRecords));
    setActiveTab('search');
  };

  const handlePreview = (record: SurgicalRecord) => {
    setSelectedRecord(record);
    setActiveTab('preview');
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col no-print">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            SurgiLog
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Medical Records</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          {(currentUser.role === 'ADMIN' || currentUser.role === 'USER') && (
            <button
              onClick={() => setActiveTab('form')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'form' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText size={20} />
              <span className="font-medium">New Record</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'search' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Search size={20} />
            <span className="font-medium">Search Records</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 uppercase">{currentUser.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <main className="flex-1 p-8 overflow-y-auto print:p-0 print:m-0 print:bg-white">
        {activeTab === 'dashboard' && <Dashboard records={records} />}
        {activeTab === 'form' && <SurgicalForm onSubmit={addRecord} onPrintPreview={handlePreview} />}
        {activeTab === 'search' && <RecordSearch records={records} onPreview={handlePreview} userRole={currentUser.role} />}
        {activeTab === 'preview' && selectedRecord && (
          <PrintPreview record={selectedRecord} onBack={() => setActiveTab(selectedRecord.id.startsWith('temp') ? 'form' : 'search')} />
        )}
      </main>
    </div>
  );
};

export default App;
