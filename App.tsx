
import React, { useState, useEffect } from 'react';
import { User, UserRole, SurgicalRecord } from './types';
import { DEFAULT_ADMINS } from './constants';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import SurgicalForm from './components/SurgicalForm';
import RecordSearch from './components/RecordSearch';
import PrintPreview from './components/PrintPreview';
import { LayoutDashboard, FileText, Search, LogOut, Loader2, RefreshCw, AlertCircle, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

// ใส่ Web App URL ที่ได้จากการ Deploy Google Apps Script (ตัวที่ redirect แล้ว)
// นี่คือ URL ที่ถูกต้องสำหรับโปรเจกต์นี้
const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiPO_0QwpmZvNzpG9oCOP-43Ab0lfk92ETTmOGWFURqLdi5zB45nkVAGQN9uNz2-JxGmFo-WshhAGkSxAy3d03M-qU-JvWfiLN8G3sxBLc_rOwXxX8XSq6Ze4nxOK2kfz3gCssOzCCxyof_Q56W7EeAUO-QvI0Mu4hibfvlKaVWUA1NX9s26tGGR8bGUcZHDUANDnqZgw9QtP8hZSGmvAqpiEM_DjkB3hoQLRiD7EaS65nh7H_Ca-dNPgMeSoZWE7JlAiR8K-argvNp6x8U4xRK0GLEhA&lib=MxdCgj-x75obG7OwBuMCD38YoiXznYos2';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'search' | 'preview'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<SurgicalRecord | null>(null);
  const [records, setRecords] = useState<SurgicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; type: 'cors' | 'network' | 'format' | null }>({ message: '', type: null });

  // ฟังก์ชันดึงข้อมูล (GET) จาก Google Sheets ผ่าน API
  const fetchRecords = async () => {
    if (!API_URL) {
        setApiError({ 
          message: "API URL is not configured. Please set the API_URL constant in App.tsx.", 
          type: 'format' 
        });
        return;
    }
    
    setIsLoading(true);
    setApiError({ message: '', type: null });
    
    try {
      // ใช้แนวทางพื้นฐานที่สุดในการดึงข้อมูลเพื่อเลี่ยง Preflight CORS
      const response = await fetch(API_URL, {
        method: 'GET',
        // ห้ามส่ง Custom Headers เพราะจะทำให้เกิด Preflight Request ที่ GAS อาจจะไม่รองรับ
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        setApiError({ 
          message: "ข้อมูลที่ได้รับไม่ใช่รายการ (Data is not an array). กรุณาตรวจสอบว่า script ส่ง return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON) หรือไม่", 
          type: 'format' 
        });
      }
    } catch (error: any) {
      console.error("Fetch failure:", error);
      
      // ข้อผิดพลาด 'Failed to fetch' มักเกิดจาก 3 สาเหตุ:
      // 1. URL ผิด
      // 2. ไม่ได้เลือก 'Who has access: Anyone' ในตอน Deploy (ทำให้ติดหน้า Login Google)
      // 3. ปัญหา CORS (ซึ่ง GAS จะแก้ได้โดยการส่ง JSON พร้อม MimeType ที่ถูกต้อง)
      if (error.message === 'Failed to fetch') {
        setApiError({ 
          message: "การเชื่อมต่อล้มเหลว (Failed to fetch): มักเกิดจากการไม่ได้ตั้งค่า 'Who has access: Anyone' ในหน้า Deploy ของ Google Apps Script หรือ URL ไม่ถูกต้อง", 
          type: 'cors' 
        });
      } else {
        setApiError({ 
          message: `เกิดข้อผิดพลาด: ${error.message}`, 
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
    if (!API_URL) {
      alert("API URL is not configured.");
      return;
    }
    setIsLoading(true);
    setApiError({ message: '', type: null });
    try {
      // การ POST ไปยัง GAS จะติดปัญหา CORS Redirect (302) เสมอ 
      // การใช้ mode: 'no-cors' จะทำให้ส่งสำเร็จแม้เบราว์เซอร์จะแจ้งว่า error (opaque response)
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'text/plain', // ใช้ text/plain เพื่อเลี่ยง preflight cors
        },
        body: JSON.stringify(record),
      });

      alert("บันทึกข้อมูลเรียบร้อยแล้ว! (ข้อมูลจะปรากฏในระบบภายใน 3-5 วินาที)");
      
      setTimeout(() => {
        fetchRecords();
        setActiveTab('search');
      }, 4000);
      
    } catch (error: any) {
      console.error("Post error:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบอินเทอร์เน็ต");
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
             <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Connection Guide</p>
                    <p className="text-[11px] leading-relaxed text-slate-600">{apiError.message}</p>
                  </div>
                </div>
                
                <div className="space-y-2 border-t border-slate-100 pt-3">
                   <p className="text-[10px] font-bold text-slate-500">วิธีแก้ไขที่ Google Script:</p>
                   <ul className="text-[9px] text-slate-400 space-y-1 ml-4 list-disc">
                      <li>Deploy > New Deployment</li>
                      <li>Execute as: <b>Me</b></li>
                      <li>Who has access: <b>Anyone</b></li>
                      <li>ตรวจสอบว่า doPost และ doGet ทำงานได้ปกติ</li>
                   </ul>
                </div>

                <div className="flex flex-col gap-2">
                   <button onClick={fetchRecords} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-3 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                      <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Retry Connectivity
                   </button>
                   {API_URL && <a 
                    href={API_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-600 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-white transition-all"
                   >
                      <ExternalLink size={12} /> Test URL (Manual)
                   </a>}
                </div>
             </div>
          )}

          {!apiError.message && records.length > 0 && (
             <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700">Cloud Connected</span>
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
                <span className="text-sm font-black uppercase tracking-[0.1em]">Syncing...</span>
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
