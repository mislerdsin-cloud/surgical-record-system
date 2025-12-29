
import React, { useState, useEffect } from 'react';
import { User, UserRole, SurgicalRecord } from './types';
import { DEFAULT_ADMINS } from './constants';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SurgicalForm from './components/SurgicalForm';
import RecordSearch from './components/RecordSearch';
import PrintPreview from './components/PrintPreview';
import { LayoutDashboard, FileText, Search, LogOut, Loader2, RefreshCw, AlertCircle, ExternalLink, ShieldAlert } from 'lucide-react';

// หลังจากการ Deploy Apps Script แล้ว ให้นำ Web App URL มาใส่ที่นี่
const API_URL = 'https://script.google.com/macros/s/AKfycbw4UDoa2Xcm6-C257hOAYa27t7LcalU4YJLld7HS81Ll-3yN2UGojQWWILfHsvrcJSUkg/exec';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'search' | 'preview'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<SurgicalRecord | null>(null);
  const [records, setRecords] = useState<SurgicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; type: 'cors' | 'network' | 'format' | null }>({ message: '', type: null });

  // ฟังก์ชันดึงข้อมูล (GET) จาก Google Sheets ผ่าน API
  const fetchRecords = async () => {
    if (!API_URL || API_URL.includes('YOUR_DEPLOYED')) return;
    
    setIsLoading(true);
    setApiError({ message: '', type: null });
    
    try {
      // เพิ่ม timestamp เพื่อป้องกัน cache และปัญหาบางอย่างของ proxy
      const fetchUrl = `${API_URL}${API_URL.includes('?') ? '&' : '?'}nocache=${Date.now()}`;
      
      const response = await fetch(fetchUrl, {
        method: 'GET',
        redirect: 'follow', // จำเป็นสำหรับ Google Apps Script เพราะมีการ Redirect ไปยัง Google Drive
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        setApiError({ 
          message: "รูปแบบข้อมูลจาก Server ไม่ถูกต้อง (Data is not an array)", 
          type: 'format' 
        });
      }
    } catch (error: any) {
      console.error("Detailed Fetch error:", error);
      
      if (error.message === 'Failed to fetch') {
        setApiError({ 
          message: "ไม่สามารถเชื่อมต่อ Cloud ได้ (CORS Error): กรุณาตรวจสอบว่าตอน Deploy ใน Apps Script ได้เลือก 'Who has access: Anyone' และ 'Execute as: Me' หรือยัง?", 
          type: 'cors' 
        });
      } else {
        setApiError({ 
          message: `Network Error: ${error.message}`, 
          type: 'network' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchRecords();
    }
  }, [currentUser]);

  const handleLogin = (email: string) => {
    let role: UserRole = 'VIEWER';
    const lowerEmail = email.toLowerCase();
    if (DEFAULT_ADMINS.some(admin => admin.toLowerCase() === lowerEmail)) {
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
    setRecords([]);
  };

  const addRecord = async (record: SurgicalRecord) => {
    setIsLoading(true);
    setApiError({ message: '', type: null });
    try {
      // สำหรับ POST ไปยัง GAS เราต้องใช้ mode: 'no-cors' เพื่อข้ามปัญหา CORS Redirect
      // แม้เบราว์เซอร์จะขึ้นว่า Error (เพราะอ่าน response ไม่ได้) แต่ข้อมูลมักจะเข้า Sheets สำเร็จ
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      alert("ระบบได้รับคำสั่งบันทึกแล้ว... กำลังรอ Cloud อัปเดตข้อมูล (ประมาณ 3-5 วินาที)");
      
      // หน่วงเวลาเพื่อให้ Script ฝั่ง Google ทำงานเสร็จสมบูรณ์
      setTimeout(() => {
        fetchRecords();
        setActiveTab('search');
      }, 4000);
      
    } catch (error: any) {
      console.error("Post error:", error);
      alert("เกิดข้อผิดพลาดทางเทคนิคในการส่งข้อมูล");
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
    <div className="flex min-h-screen bg-slate-50 font-['Sarabun']">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col no-print shadow-xl relative z-20">
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
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-2xl translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-bold text-sm">Dashboard</span>
          </button>

          {(currentUser.role === 'ADMIN' || currentUser.role === 'USER') && (
            <button
              onClick={() => setActiveTab('form')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'form' ? 'bg-slate-900 text-white shadow-2xl translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <FileText size={20} />
              <span className="font-bold text-sm">New Operative Record</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'search' ? 'bg-slate-900 text-white shadow-2xl translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <Search size={20} />
            <span className="font-bold text-sm">Record Database</span>
          </button>
        </nav>

        <div className="p-6 space-y-4">
          {apiError.message && (
             <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${apiError.type === 'cors' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                <div className="flex items-start gap-3">
                  {apiError.type === 'cors' ? <ShieldAlert size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold leading-tight uppercase">API Connectivity Issue</p>
                    <p className="text-[10px] leading-relaxed opacity-80">{apiError.message}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                   <button onClick={fetchRecords} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider bg-slate-800 text-white px-3 py-2 rounded-xl hover:bg-black transition-all">
                      <RefreshCw size={10} className={isLoading ? 'animate-spin' : ''} /> Retry Sync
                   </button>
                   <a 
                    href={API_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider border border-slate-300 px-3 py-2 rounded-xl hover:bg-white/50 transition-all"
                   >
                      <ExternalLink size={10} /> Test Web App URL
                   </a>
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

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto print:p-0 print:m-0 print:bg-white relative">
        {isLoading && activeTab !== 'preview' && (
          <div className="fixed top-8 right-8 z-50 no-print animate-slideInRight">
             <div className="flex items-center gap-3 text-blue-600 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl border border-blue-50">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm font-black uppercase tracking-[0.1em]">Syncing with Cloud...</span>
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
