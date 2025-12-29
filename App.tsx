
import React, { useState, useEffect } from 'react';
import { User, UserRole, SurgicalRecord } from './types';
import { DEFAULT_ADMINS } from './constants';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SurgicalForm from './components/SurgicalForm';
import RecordSearch from './components/RecordSearch';
import PrintPreview from './components/PrintPreview';
import { LayoutDashboard, FileText, Search, LogOut, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

// หลังจากการ Deploy Apps Script แล้ว ให้นำ Web App URL มาใส่ที่นี่
const API_URL = 'https://script.google.com/macros/s/AKfycbw4UDoa2Xcm6-C257hOAYa27t7LcalU4YJLld7HS81Ll-3yN2UGojQWWILfHsvrcJSUkg/exec';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'search' | 'preview'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<SurgicalRecord | null>(null);
  const [records, setRecords] = useState<SurgicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // ฟังก์ชันดึงข้อมูล (GET) จาก Google Sheets ผ่าน API
  const fetchRecords = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records:", error);
      setApiError("ไม่สามารถดึงข้อมูลจากระบบ Cloud ได้ กรุณาตรวจสอบการตั้งค่า Apps Script");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRecords();
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
    fetchRecords();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user_session');
  };

  // ฟังก์ชันส่งข้อมูล (POST) ไปยัง Google Sheets ผ่าน API
  const addRecord = async (record: SurgicalRecord) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // หมายเหตุ: การใช้ fetch กับ GAS มักติดปัญหา CORS 
      // การใช้ mode: 'no-cors' จะส่งข้อมูลได้สำเร็จ แต่ฝั่ง Client จะไม่สามารถอ่าน Response ได้
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      // แจ้งผู้ใช้ว่าส่งข้อมูลแล้ว
      alert("กำลังส่งข้อมูลไปยัง Google Sheets... กรุณารอซิงค์ข้อมูลสักครู่");
      
      // รอเวลาให้ Google Script ทำงานเสร็จก่อนดึงข้อมูลใหม่
      setTimeout(() => {
        fetchRecords();
        setActiveTab('search');
      }, 2500);
      
    } catch (error) {
      console.error("Failed to save record:", error);
      setApiError("เกิดข้อผิดพลาดในการส่งข้อมูลไปยังระบบ Cloud");
      alert("บันทึกล้มเหลว กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
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
      <div className="w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col no-print shadow-xl shadow-slate-200/50 relative z-20">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <FileText size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">SurgiLog</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Surgical Information System</p>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-2xl shadow-slate-400 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-bold text-sm">Dashboard</span>
          </button>

          {(currentUser.role === 'ADMIN' || currentUser.role === 'USER') && (
            <button
              onClick={() => setActiveTab('form')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'form' ? 'bg-slate-900 text-white shadow-2xl shadow-slate-400 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <FileText size={20} />
              <span className="font-bold text-sm">New Operative Record</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'search' ? 'bg-slate-900 text-white shadow-2xl shadow-slate-400 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <Search size={20} />
            <span className="font-bold text-sm">Record Database</span>
          </button>
        </nav>

        <div className="p-6 space-y-4">
          {apiError && (
             <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                   <p className="text-[11px] font-bold leading-tight">{apiError}</p>
                   <button onClick={fetchRecords} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-3 py-1.5 rounded-lg">
                      <RefreshCw size={10} /> Retry
                   </button>
                </div>
             </div>
          )}

          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl shadow-inner">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-800 truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentUser.role}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {/* พื้นที่แสดงผลหลัก */}
      <main className="flex-1 p-10 overflow-y-auto print:p-0 print:m-0 print:bg-white relative">
        {isLoading && activeTab !== 'preview' && (
          <div className="fixed top-8 right-8 z-50 no-print">
             <div className="flex items-center gap-3 text-blue-600 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-blue-50">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm font-black uppercase tracking-widest">Cloud Syncing...</span>
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
