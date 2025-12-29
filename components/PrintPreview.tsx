
import React from 'react';
import { SurgicalRecord } from '../types';
import { ChevronLeft, Printer, FileText } from 'lucide-react';

interface PrintPreviewProps {
  record: SurgicalRecord;
  onBack: () => void;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ record, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <ChevronLeft size={20} />
          Back to Search
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 font-bold hover:bg-blue-700 transition-all active:scale-95"
        >
          <Printer size={20} />
          Print Operative Report
        </button>
      </div>

      {/* Actual Form for Printing */}
      <div className="bg-white border border-slate-200 shadow-xl max-w-[210mm] mx-auto p-[15mm] print:border-0 print:shadow-none print:m-0 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-slate-900 pb-2 mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center font-bold text-xl">F6</div>
             <h1 className="text-2xl font-black uppercase tracking-tighter">Operative Record</h1>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-black">ร.พ. 8</h1>
          </div>
        </div>

        {/* Clinical Info Section */}
        <div className="space-y-4 text-[13px] leading-relaxed">
          <div className="flex justify-between gap-6">
            <div className="flex-1 border-b border-slate-300">
              <span className="font-black text-slate-500 uppercase text-[10px] block">Date of operation</span>
              <span className="text-sm">{new Date(record.timestamp).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="w-1/4 border-b border-slate-300">
              <span className="font-black text-slate-500 uppercase text-[10px] block">Time</span>
              <span className="text-sm">{record.startTime || '--:--'} - {record.endTime || '--:--'}</span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 border-b border-slate-300">
              <span className="font-black text-slate-500 uppercase text-[10px] block">Surgeon</span>
              <span className="text-sm font-bold">{record.surgeon}</span>
            </div>
            <div className="flex-1 border-b border-slate-300">
              <span className="font-black text-slate-500 uppercase text-[10px] block">Assistant(s)</span>
              <span className="text-sm">{[record.assistant1, record.assistant2].filter(Boolean).join(', ') || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="border-b border-slate-300">
              <span className="font-black text-slate-500 uppercase text-[10px] block">Anesthesiologist</span>
              <span className="text-sm">{record.anesthesiologist || 'N/A'}</span>
            </div>
            <div className="border-b border-slate-300">
              <span className="font-black text-slate-500 uppercase text-[10px] block">Anesthesia Type</span>
              <span className="text-sm">{record.anesthesiaType || 'N/A'}</span>
            </div>
            <div className="border-b border-slate-300">
              <span className="font-black text-slate-500 uppercase text-[10px] block">Surgical Nurse</span>
              <span className="text-sm">{record.surgicalNurse || 'N/A'}</span>
            </div>
          </div>

          <div className="border-b border-slate-300">
            <span className="font-black text-slate-500 uppercase text-[10px] block">Clinical diagnosis</span>
            <span className="text-sm">{record.clinicalDiagnosis || 'N/A'}</span>
          </div>
          <div className="border-b border-slate-300">
            <span className="font-black text-slate-500 uppercase text-[10px] block">Post-operative diagnosis</span>
            <span className="text-sm font-bold">{record.postOpDiagnosis || 'N/A'}</span>
          </div>
          <div className="border-b border-slate-300 bg-slate-50 p-2">
            <span className="font-black text-slate-500 uppercase text-[10px] block">Operative procedure</span>
            <span className="text-base font-black">{record.operativeProcedure}</span>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="col-span-3 space-y-4">
              <div className="min-h-[120px] border border-slate-300 p-3">
                <p className="font-black underline mb-2 text-xs uppercase tracking-widest text-slate-400">Findings & Pathology:</p>
                <div className="whitespace-pre-wrap text-sm">{record.operativeNote || 'No specific findings logged.'}</div>
              </div>
              
              <div className="min-h-[200px] border border-slate-300 p-3">
                <p className="font-black underline mb-2 text-xs uppercase tracking-widest text-slate-400">Description of Operation:</p>
                <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b border-slate-100">
                   <p><span className="font-black text-[10px] uppercase text-slate-400 block">Position</span> {record.position || 'Standard'}</p>
                   <p><span className="font-black text-[10px] uppercase text-slate-400 block">Incision</span> {record.incision || 'N/A'}</p>
                </div>
                <div className="text-sm leading-relaxed">
                   Detailed procedural logs stored in hospital database under ID: {record.id}.
                </div>
              </div>
            </div>

            <div className="col-span-1 border-2 border-slate-900 p-3 bg-slate-50">
              <p className="text-center font-black underline mb-3 text-[10px] uppercase tracking-tighter">Surgical Classification</p>
              <div className="space-y-1.5 mb-5">
                {[
                  { val: '1', label: 'Class I / Clean' },
                  { val: '2', label: 'Class II / Clean-Contam' },
                  { val: '3', label: 'Class III / Contam' },
                  { val: '4', label: 'Class IV / Dirty' }
                ].map(item => (
                  <div key={item.val} className={`text-[10px] flex items-center gap-2 ${record.woundClassification === item.val ? 'font-bold' : 'opacity-30'}`}>
                    <div className={`w-3 h-3 border border-slate-900 ${record.woundClassification === item.val ? 'bg-slate-900' : ''}`}></div>
                    {item.label}
                  </div>
                ))}
              </div>
              
              <div className="space-y-1.5 text-[9px] border-t border-slate-300 pt-3">
                <p className="flex justify-between font-bold"><span>Epidural</span> <span>{record.epidural ? 'YES' : 'NO'}</span></p>
                <p className="flex justify-between font-bold"><span>A-Line</span> <span>{record.aLine ? 'YES' : 'NO'}</span></p>
                <p className="flex justify-between font-bold"><span>Central Line</span> <span>{record.centralLine ? 'YES' : 'NO'}</span></p>
                <p className="flex justify-between font-bold"><span>Foley Cath.</span> <span>{record.foleyCatheter ? 'YES' : 'NO'}</span></p>
                <p className="flex justify-between font-bold"><span>Hair Removed</span> <span>{record.hairRemoved ? 'YES' : 'NO'}</span></p>
                
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <p className="font-black text-slate-400 mb-1 uppercase">Antibiotic:</p>
                  <p className="font-bold">{record.antibiotic || 'Prophylaxis'}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 mt-2">
                  <p className="font-black text-slate-400 mb-1 uppercase">Skin Preparation:</p>
                  <p className="flex justify-between"><span>Scrub:</span> <span>{record.skinScrub ? 'Done' : 'N/A'}</span></p>
                  <p className="flex justify-between"><span>Antiseptic:</span> <span>{record.skinAntiseptic ? 'Done' : 'N/A'}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px] mt-6 bg-slate-100 p-4 border border-slate-200">
            <div className="space-y-1">
              <p><span className="font-black text-slate-500 uppercase mr-2">Blood Transfusion (PRC):</span> <span className="font-bold">{record.bloodTransfusion || 'None'}</span></p>
              <p><span className="font-black text-slate-500 uppercase mr-2">Est. Blood Loss:</span> <span className="font-bold text-red-600">{record.bloodLoss || '0'} ml</span></p>
            </div>
            <div className="space-y-1">
              <p><span className="font-black text-slate-500 uppercase mr-2">Specimen:</span> <span className="font-bold">{record.specimen || 'None'}</span></p>
              <p><span className="font-black text-slate-500 uppercase mr-2">Complications:</span> <span className="font-bold">{record.complications || 'None'}</span></p>
            </div>
          </div>
        </div>

        {/* Footer info box */}
        <div className="mt-10 grid grid-cols-3 border-2 border-slate-900 divide-x-2 divide-slate-900 text-[11px] bg-slate-50">
          <div className="p-3">
            <p className="font-black text-slate-400 mb-1 uppercase text-[9px]">Name of Patient</p>
            <p className="text-sm font-black">{record.patientName}</p>
          </div>
          <div className="p-3">
            <p className="font-black text-slate-400 mb-1 uppercase text-[9px]">Hospital Number</p>
            <p className="text-sm font-black text-blue-700">{record.hospitalNumber}</p>
          </div>
          <div className="p-3">
            <p className="font-black text-slate-400 mb-1 uppercase text-[9px]">Department / Ward</p>
            <p className="text-sm font-black">{record.department} / {record.ward || 'General'}</p>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase">Confidential Medical Record - Hospital Authority</p>
        </div>

        {/* Page 2: Images */}
        <div className="page-break-before-always mt-[25mm] print:mt-0 print:pt-[25mm]">
          <div className="flex justify-between items-end border-b-2 border-slate-900 pb-2 mb-6">
            <div className="flex items-center gap-3">
               <div className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center font-bold text-xl">F6</div>
               <h1 className="text-2xl font-black uppercase tracking-tighter">Images & Supplements</h1>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black">ร.พ. 8</h1>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 h-[350px] mb-8">
            <div className="border-2 border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50 overflow-hidden relative">
              <span className="absolute top-2 left-2 text-[10px] font-black text-slate-300 bg-white px-2 py-1 rounded shadow-sm">IMAGE 1</span>
              {record.image1Url ? (
                <img src={record.image1Url} alt="Photo 1" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center opacity-20">
                   <FileText size={48} className="mx-auto mb-2" />
                   <p className="text-[10px] font-bold">No Image Provided</p>
                </div>
              )}
            </div>
            <div className="border-2 border-slate-200 rounded-lg p-2 flex items-center justify-center bg-slate-50 overflow-hidden relative">
              <span className="absolute top-2 left-2 text-[10px] font-black text-slate-300 bg-white px-2 py-1 rounded shadow-sm">IMAGE 2</span>
              {record.image2Url ? (
                <img src={record.image2Url} alt="Photo 2" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center opacity-20">
                   <FileText size={48} className="mx-auto mb-2" />
                   <p className="text-[10px] font-bold">No Image Provided</p>
                </div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 p-6 h-[300px] bg-slate-50 rounded-xl">
            <p className="font-black underline mb-3 text-xs uppercase tracking-widest text-slate-400">Additional Descriptions / Post-Op Notes:</p>
            <div className="space-y-4">
               <div className="border-b border-dotted border-slate-300 w-full h-8"></div>
               <div className="border-b border-dotted border-slate-300 w-full h-8"></div>
               <div className="border-b border-dotted border-slate-300 w-full h-8"></div>
               <div className="border-b border-dotted border-slate-300 w-full h-8"></div>
            </div>
          </div>

          <div className="mt-24 flex justify-end">
             <div className="text-center w-80">
                <div className="border-b-2 border-slate-900 mb-2"></div>
                <p className="font-bold text-sm">( {record.surgeon} )</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Primary Surgeon Signature</p>
                <p className="text-[10px] text-slate-400 mt-1 italic">Date: {new Date().toLocaleDateString()}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
