
import React, { useState, useEffect } from 'react';
import { User, UserRole, SurgicalRecord } from './types';
import { DEFAULT_ADMINS } from './constants';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SurgicalForm from './components/SurgicalForm';
import RecordSearch from './components/RecordSearch';
import PrintPreview from './components/PrintPreview';
import { LayoutDashboard, FileText, Search, LogOut, Loader2 } from 'lucide-react';

// หลังจาก Deploy Apps Script แล้ว ให้นำ Web App URL มาใส่ที่นี่
const API_URL = 'https://script.google.com/macros/s/AKfycbw4UDoa2Xcm6-C257hOAYa27t7LcalU4YJLld7HS81Ll-3yN2UGojQWWILfHsvrcJSUkg/exec';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'search' | 'preview'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<SurgicalRecord | null>(null);
  const [records, setRecords] = useState<SurgicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูล (GET) จาก Google Sheets ผ่าน API
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // โหลดข้อมูลเมื่อเข้าแอป
    if (currentUser) {
      fetchRecords();
    }
    const session = localStorage.getItem('user_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, [currentUser]);

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

  // ฟังก์ชันส่งข้อมูล (POST) ไปยัง Google Sheets ผ่าน API
  const addRecord = async (record: SurgicalRecord) => {
    setIsLoading(true);
    try {
      // หมายเหตุ: การใช้ fetch กับ GAS มักติดปัญหา CORS 
      // การใช้ mode: 'no-cors' จะส่งข้อมูลได้ แต่เราจะอ่าน response ไม่ได้
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      // รอเวลาเล็กน้อยเพื่อให้ฝั่ง Server ประมวลผลก่อนดึงข้อมูลใหม่
      setTimeout(() => {
        fetchRecords();
        setActiveTab('search');
        alert("บันทึกข้อมูลเรียบร้อยแล้ว (กำลังซิงค์ข้อมูลกับระบบ Cloud)");
      }, 1500);
      
    } catch (error) {
      console.error("Failed to save record:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
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
      {/* Sidebar - ซ่อนอัตโนมัติเมื่อพิมพ์ */}
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
          {isLoading && (
            <div className="mb-4 flex items-center justify-center gap-2 text-xs text-blue-600 font-bold bg-blue-50 py-2 rounded-lg animate-pulse">
              <Loader2 className="animate-spin" size={14} />
              Syncing...
            </div>
          )}
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

      {/* พื้นที่แสดงผลหลัก */}
      <main className="flex-1 p-8 overflow-y-auto print:p-0 print:m-0 print:bg-white relative">
        {isLoading && activeTab !== 'preview' && (
          <div className="absolute top-4 right-8 no-print">
             <div className="flex items-center gap-2 text-blue-600 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm font-medium">Syncing Cloud...</span>
             </div>
          </div>
        )}

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
