
import React from 'react';
import { SurgicalRecord } from '../types';
import { ChevronLeft, Printer } from 'lucide-react';

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
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Search
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 font-bold hover:bg-blue-700 transition-all active:scale-95"
        >
          <Printer size={20} />
          Print Report
        </button>
      </div>

      {/* Actual Form for Printing */}
      <div className="bg-white border border-slate-200 shadow-xl max-w-[210mm] mx-auto p-[10mm] print:border-0 print:shadow-none print:m-0 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-2 mb-4">
          <div>
            <h1 className="text-xl font-bold uppercase">Form 6</h1>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold">ร.พ. 8</h1>
          </div>
        </div>

        {/* Clinical Info Section */}
        <div className="space-y-4 text-sm leading-relaxed">
          <div className="flex justify-between gap-4">
            <div className="flex-1 border-b border-dotted border-slate-400">
              <span className="font-bold">Date of operation:</span> {new Date(record.timestamp).toLocaleDateString('th-TH')}
            </div>
            <div className="w-1/3 border-b border-dotted border-slate-400">
              <span className="font-bold">Time:</span> {record.startTime} - {record.endTime}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 border-b border-dotted border-slate-400">
              <span className="font-bold">Surgeon:</span> {record.surgeon}
            </div>
            <div className="flex-1 border-b border-dotted border-slate-400">
              <span className="font-bold">Assistant:</span> {record.assistant1}, {record.assistant2}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border-b border-dotted border-slate-400">
              <span className="font-bold">Anesthesiologist:</span> {record.anesthesiologist}
            </div>
            <div className="border-b border-dotted border-slate-400">
              <span className="font-bold">Anesthesia:</span> {record.anesthesiaType}
            </div>
            <div className="border-b border-dotted border-slate-400">
              <span className="font-bold">Surgical nurse:</span> {record.surgicalNurse}
            </div>
          </div>

          <div className="border-b border-dotted border-slate-400">
            <span className="font-bold">Clinical diagnosis:</span> {record.clinicalDiagnosis}
          </div>
          <div className="border-b border-dotted border-slate-400">
            <span className="font-bold">Post-operative diagnosis:</span> {record.postOpDiagnosis}
          </div>
          <div className="border-b border-dotted border-slate-400">
            <span className="font-bold">Operative procedure:</span> {record.operativeProcedure}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="col-span-3 space-y-4">
              <div className="min-h-[100px] border border-slate-300 p-2">
                <p className="font-bold underline mb-1">Finding:</p>
                <div className="whitespace-pre-wrap">{record.operativeNote || 'N/A'}</div>
              </div>
              
              <div className="min-h-[150px] border border-slate-300 p-2">
                <p className="font-bold underline mb-1">Description of Operation:</p>
                <p><span className="font-medium">Position:</span> {record.position}</p>
                <p><span className="font-medium">Incision:</span> {record.incision}</p>
                <div className="mt-4 whitespace-pre-wrap">Detailed procedure steps logged in master file...</div>
              </div>
            </div>

            <div className="col-span-1 border border-slate-800 p-3 bg-slate-50">
              <p className="text-center font-bold underline mb-3 text-xs">Surgical Wound Classification</p>
              <ul className="space-y-1 text-xs mb-4">
                <li className={record.woundClassification === '1' ? 'font-bold flex items-center gap-1' : 'opacity-40 flex items-center gap-1'}>
                  <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span> Class I / Clean
                </li>
                <li className={record.woundClassification === '2' ? 'font-bold flex items-center gap-1' : 'opacity-40 flex items-center gap-1'}>
                  <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span> Class II / Clean-Contam
                </li>
                <li className={record.woundClassification === '3' ? 'font-bold flex items-center gap-1' : 'opacity-40 flex items-center gap-1'}>
                  <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span> Class III / Contam
                </li>
                <li className={record.woundClassification === '4' ? 'font-bold flex items-center gap-1' : 'opacity-40 flex items-center gap-1'}>
                  <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span> Class IV / Dirty
                </li>
              </ul>
              <div className="space-y-1 text-[10px]">
                <p>Epidural Anesthesia: <span className="font-bold">{record.epidural ? 'Yes' : 'No'}</span></p>
                <p>A-Line: <span className="font-bold">{record.aLine ? 'Yes' : 'No'}</span></p>
                <p>Central Line: <span className="font-bold">{record.centralLine ? 'Yes' : 'No'}</span></p>
                <p>Foley Catheter: <span className="font-bold">{record.foleyCatheter ? 'Yes' : 'No'}</span></p>
                <p>Hair Removed: <span className="font-bold">{record.hairRemoved ? 'Yes' : 'No'}</span></p>
                <p>Antibiotic: <span className="font-bold">{record.antibiotic || 'Prophylaxis'}</span></p>
                <div className="pt-2 border-t border-slate-300 mt-2">
                  <p className="font-bold mb-1">Skin Prep:</p>
                  <p>Scrub: {record.skinScrub ? 'Done' : 'N/A'}</p>
                  <p>Antiseptic: {record.skinAntiseptic ? 'Done' : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs mt-4">
            <p><span className="font-bold">Intraoperative blood transfusion (PRC):</span> {record.bloodTransfusion || 'No'}</p>
            <p><span className="font-bold">Intraoperative complication:</span> {record.complications || 'None'}</p>
            <div className="flex gap-10">
              <p><span className="font-bold">Estimated blood loss:</span> {record.bloodLoss || '0'} ml</p>
              <p><span className="font-bold">Specimen for pathology:</span> {record.specimen ? `Yes (${record.specimen})` : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Footer info box */}
        <div className="mt-8 grid grid-cols-3 border border-slate-800 divide-x divide-slate-800 text-[10px]">
          <div className="p-1">
            <p className="font-bold text-slate-500 mb-1">Name of Patient</p>
            <p className="text-sm font-bold">{record.patientName}</p>
          </div>
          <div className="p-1">
            <p className="font-bold text-slate-500 mb-1">Hospital Number</p>
            <p className="text-sm font-bold">{record.hospitalNumber}</p>
          </div>
          <div className="p-1">
            <p className="font-bold text-slate-500 mb-1">Department / Ward</p>
            <p className="text-sm font-bold">{record.department} / {record.ward}</p>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] font-bold tracking-widest uppercase">Operative Record Sheet</p>
        </div>

        {/* Page 2: Images */}
        <div className="page-break-before-always mt-[20mm] print:mt-0 print:pt-[20mm]">
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-2 mb-4">
            <h1 className="text-xl font-bold uppercase">Form 6 (Page 2)</h1>
            <h1 className="text-xl font-bold">ร.พ. 8</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-[300px] mb-6">
            <div className="border border-slate-300 rounded p-2 flex items-center justify-center bg-slate-50 overflow-hidden">
              {record.image1Url ? (
                <img src={record.image1Url} alt="Photo 1" className="max-w-full max-h-full object-contain" />
              ) : (
                <p className="text-slate-400 text-xs italic">No image provided</p>
              )}
            </div>
            <div className="border border-slate-300 rounded p-2 flex items-center justify-center bg-slate-50 overflow-hidden">
              {record.image2Url ? (
                <img src={record.image2Url} alt="Photo 2" className="max-w-full max-h-full object-contain" />
              ) : (
                <p className="text-slate-400 text-xs italic">No image provided</p>
              )}
            </div>
          </div>

          <div className="border border-slate-300 p-4 h-[300px]">
            <p className="font-bold underline mb-2 text-sm">Description of operation (continue)</p>
            <div className="text-xs text-slate-400">....................................................................................</div>
          </div>

          <div className="mt-20 flex justify-end">
             <div className="text-center w-64 border-t border-dotted border-slate-800 pt-1 text-sm">
                ( {record.surgeon} )<br/>
                Surgeon Signature
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
