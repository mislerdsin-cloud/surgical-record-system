
import React, { useState } from 'react';
import { SurgicalRecord } from '../types';
import AutocompleteInput from './AutocompleteInput';
import { DEPARTMENTS } from '../constants';
import { Save, Image as ImageIcon, Printer, Thermometer, Droplets, Info } from 'lucide-react';

interface SurgicalFormProps {
  onSubmit: (record: SurgicalRecord) => void;
  onPrintPreview?: (record: SurgicalRecord) => void;
}

const SurgicalForm: React.FC<SurgicalFormProps> = ({ onSubmit, onPrintPreview }) => {
  const [formData, setFormData] = useState<Partial<SurgicalRecord>>({
    timestamp: new Date().toISOString(),
    startTime: '',
    endTime: '',
    hospitalNumber: '',
    patientName: '',
    ward: '',
    department: '',
    surgeon: '',
    assistant1: '',
    assistant2: '',
    anesthesiologist: '',
    anesthesiaType: '',
    surgicalNurse: '',
    clinicalDiagnosis: '',
    postOpDiagnosis: '',
    operativeProcedure: '',
    position: '',
    incision: '',
    operativeNote: '',
    bloodLoss: '',
    specimen: '',
    complications: '',
    woundClassification: '1',
    epidural: false,
    aLine: false,
    centralLine: false,
    foleyCatheter: false,
    hairRemoved: false,
    antibiotic: '',
    skinScrub: false,
    skinAntiseptic: false,
    bloodTransfusion: '',
    image1Url: '',
    image2Url: '',
  });

  const handleChange = (field: keyof SurgicalRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: 'image1Url' | 'image2Url', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: SurgicalRecord = {
      ...formData as SurgicalRecord,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    onSubmit(record);
  };

  const handleQuickPrint = () => {
    if (!formData.hospitalNumber || !formData.patientName) {
      alert("กรุณากรอก Hospital Number และชื่อผู้ป่วยก่อนสั่งพิมพ์");
      return;
    }
    const tempRecord: SurgicalRecord = {
      ...formData as SurgicalRecord,
      id: 'temp-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    if (onPrintPreview) onPrintPreview(tempRecord);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn pb-20">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">New Operative Record</h2>
            <p className="text-slate-500">บันทึกข้อมูลการผ่าตัด (ร.พ. 8)</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleQuickPrint}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all font-semibold shadow-sm"
            >
              <Printer size={18} />
              Print Draft
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Patient Info */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
              Patient Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hospital Number (HN)</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.hospitalNumber}
                  onChange={(e) => handleChange('hospitalNumber', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Patient Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.patientName}
                  onChange={(e) => handleChange('patientName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Ward</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.ward}
                  onChange={(e) => handleChange('ward', e.target.value)}
                  placeholder="Ward/Building Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Department</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 text-xs">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 text-xs">End Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Medical Team */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              Medical Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AutocompleteInput 
                label="Surgeon" 
                value={formData.surgeon || ''} 
                onChange={(v) => handleChange('surgeon', v)}
                required
              />
              <AutocompleteInput 
                label="Assistant 1" 
                value={formData.assistant1 || ''} 
                onChange={(v) => handleChange('assistant1', v)}
              />
              <AutocompleteInput 
                label="Assistant 2" 
                value={formData.assistant2 || ''} 
                onChange={(v) => handleChange('assistant2', v)}
              />
              <AutocompleteInput 
                label="Anesthesiologist" 
                value={formData.anesthesiologist || ''} 
                onChange={(v) => handleChange('anesthesiologist', v)}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Anesthesia Type</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.anesthesiaType}
                  onChange={(e) => handleChange('anesthesiaType', e.target.value)}
                  placeholder="GA, Spinal, etc."
                />
              </div>
              <AutocompleteInput 
                label="Surgical Nurse" 
                value={formData.surgicalNurse || ''} 
                onChange={(v) => handleChange('surgicalNurse', v)}
              />
            </div>
          </section>

          {/* Clinical Details */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
              Operative Details
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.clinicalDiagnosis}
                    onChange={(e) => handleChange('clinicalDiagnosis', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Post-op Diagnosis</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.postOpDiagnosis}
                    onChange={(e) => handleChange('postOpDiagnosis', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Operative Procedure</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.operativeProcedure}
                    onChange={(e) => handleChange('operativeProcedure', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Position</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    placeholder="e.g. Supine, Prone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Incision</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={formData.incision}
                    onChange={(e) => handleChange('incision', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Droplets size={14} className="text-red-500" /> Blood Loss (ml)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.bloodLoss}
                      onChange={(e) => handleChange('bloodLoss', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Specimen</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.specimen}
                      onChange={(e) => handleChange('specimen', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Complications</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.complications}
                  onChange={(e) => handleChange('complications', e.target.value)}
                  placeholder="None"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Operative Note</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.operativeNote}
                  onChange={(e) => handleChange('operativeNote', e.target.value)}
                  placeholder="Findings and description of operation..."
                ></textarea>
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Info size={20} className="text-slate-400" />
              Wound & Checklist
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">Wound Classification</label>
                <div className="flex flex-wrap gap-4">
                  {['1', '2', '3', '4'].map(val => (
                    <label key={val} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-all flex-1 min-w-[100px] justify-center">
                      <input 
                        type="radio" 
                        name="woundClass" 
                        className="w-5 h-5 accent-blue-600"
                        checked={formData.woundClassification === val}
                        onChange={() => handleChange('woundClassification', val)}
                      />
                      <span className="text-sm font-bold">Class {val}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { field: 'epidural', label: 'Epidural' },
                  { field: 'aLine', label: 'A-Line' },
                  { field: 'centralLine', label: 'Central Line' },
                  { field: 'foleyCatheter', label: 'Foley' },
                  { field: 'hairRemoved', label: 'Hair Removed' },
                  { field: 'skinScrub', label: 'Skin Scrub' },
                  { field: 'skinAntiseptic', label: 'Antiseptic' }
                ].map(item => (
                  <label key={item.field} className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-blue-50 transition-all">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-blue-600"
                      checked={!!formData[item.field as keyof SurgicalRecord]}
                      onChange={(e) => handleChange(item.field as keyof SurgicalRecord, e.target.checked)}
                    />
                    <span className="text-[10px] font-bold text-slate-600 uppercase text-center leading-tight">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Antibiotic</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.antibiotic}
                  onChange={(e) => handleChange('antibiotic', e.target.value)}
                  placeholder="Name and dosage"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Blood Transfusion</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.bloodTransfusion}
                  onChange={(e) => handleChange('bloodTransfusion', e.target.value)}
                  placeholder="Units/Type (e.g. 2 PRC)"
                />
              </div>
            </div>
          </section>

          {/* Photos */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              Image Attachments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Photo 1</label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-4 h-64 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 group transition-all hover:border-blue-400">
                  {formData.image1Url ? (
                    <>
                      <img src={formData.image1Url} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="text-slate-300 mx-auto mb-2" size={48} />
                      <p className="text-xs text-slate-400 font-medium">Click or Drag to Upload Image 1</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload('image1Url', e)} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Photo 2</label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-4 h-64 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 group transition-all hover:border-blue-400">
                  {formData.image2Url ? (
                    <>
                      <img src={formData.image2Url} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="text-slate-300 mx-auto mb-2" size={48} />
                      <p className="text-xs text-slate-400 font-medium">Click or Drag to Upload Image 2</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload('image2Url', e)} />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
            <button
              type="submit"
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Save size={20} />
              Save Record to Cloud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurgicalForm;
