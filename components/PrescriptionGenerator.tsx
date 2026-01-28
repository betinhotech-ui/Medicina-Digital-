
import React, { useState, useRef } from 'react';
import { Pill, Printer, Sparkles, Building2, Download, Loader2 } from 'lucide-react';
import { ClinicSettings, Patient, Doctor, Hospital } from '../types';
import { refineMedicalText } from '../services/geminiService';

interface PrescriptionGeneratorProps {
  settings: ClinicSettings;
  patients: Patient[];
  doctors: Doctor[];
  hospitals: Hospital[];
}

export const PrescriptionGenerator: React.FC<PrescriptionGeneratorProps> = ({ settings, patients, doctors, hospitals }) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [prescription, setPrescription] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [paperSize, setPaperSize] = useState<'a4' | 'a5'>('a4');
  const printRef = useRef<HTMLDivElement>(null);

  const selectedPatient = patients.find(p => p.id === patientId);
  const selectedDoctor = doctors.find(d => d.id === doctorId);
  const selectedHospital = hospitals.find(h => h.id === hospitalId);

  const docHeader = {
    name: selectedHospital?.name || settings.name,
    cnpj: selectedHospital?.cnpj || settings.cnpj,
    address: selectedHospital?.address || settings.address,
    phone: selectedHospital?.phone || settings.phone,
    logo: selectedHospital?.logo || settings.logo
  };

  const handleRefine = async () => {
    if (!prescription) return;
    setIsRefining(true);
    const refined = await refineMedicalText(prescription, 'receita');
    setPrescription(refined || prescription);
    setIsRefining(false);
  };

  const handleDownloadPDF = async () => {
    if (!selectedPatient) {
      alert("Por favor, selecione um paciente primeiro.");
      return;
    }
    
    setIsDownloading(true);
    const element = printRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `Receituario_${selectedPatient.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: paperSize, orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Use a opção de imprimir.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Receituário Médico</h1>
          <p className="text-slate-500">Emissão de prescrições e download em PDF</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setPaperSize('a4')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${paperSize === 'a4' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                A4
              </button>
              <button 
                onClick={() => setPaperSize('a5')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${paperSize === 'a5' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                A5
              </button>
           </div>
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading || !selectedPatient}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center space-x-2 font-bold shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            <span>Baixar Receita</span>
          </button>
          <button 
            onClick={handlePrint}
            className="bg-slate-800 text-white p-2.5 rounded-xl hover:bg-slate-900 transition-all shadow-md"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Pill className="text-emerald-600" size={20} />
            <span>Detalhes da Prescrição</span>
          </h2>
          
          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" />
                Unidade de Atendimento
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                value={hospitalId}
                onChange={e => setHospitalId(e.target.value)}
              >
                <option value="">Clínica Principal</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Paciente</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                >
                  <option value="">Selecione o paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Médico</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
                >
                  <option value="">Selecione o médico</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Medicamentos e Posologia</label>
                <button 
                  onClick={handleRefine}
                  disabled={isRefining || !prescription}
                  className="text-xs flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-bold disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  <span>{isRefining ? 'Otimizando...' : 'Otimizar via IA'}</span>
                </button>
              </div>
              <textarea 
                rows={8}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                placeholder="Ex: 1. Amoxicilina 500mg - Tomar 1 caps de 8/8h..."
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-slate-100 p-8 rounded-2xl flex items-start justify-center overflow-auto">
          <div className={`bg-white shadow-2xl p-10 flex flex-col justify-between border-t-4 border-emerald-500 transition-all ${paperSize === 'a4' ? 'w-full max-w-[500px] min-h-[650px]' : 'w-full max-w-[350px] min-h-[450px]'}`}>
             <div className="space-y-6">
                <div className="text-center space-y-1 border-b pb-4">
                  {docHeader.logo && <img src={docHeader.logo} className="h-10 mx-auto mb-2 grayscale opacity-70" alt="Logo" />}
                  <h3 className={`${paperSize === 'a4' ? 'text-lg' : 'text-sm'} font-bold text-slate-800 uppercase`}>{docHeader.name}</h3>
                  <div className="text-[9px] text-slate-400 space-y-0.5">
                    <p>CNPJ: {docHeader.cnpj}</p>
                    <p>{docHeader.address}</p>
                    <p>Tel: {docHeader.phone}</p>
                  </div>
                </div>

                <div className="text-center py-2">
                  <h2 className={`${paperSize === 'a4' ? 'text-xl' : 'text-lg'} font-serif font-bold text-slate-900 border-b-2 border-emerald-100 inline-block px-4`}>RECEITUÁRIO</h2>
                </div>

                <div className="px-2 space-y-4">
                  <div className={`${paperSize === 'a4' ? 'text-sm' : 'text-xs'} border-b pb-2`}>
                    <span className="text-slate-500">PACIENTE:</span> <span className="font-bold text-slate-800">{selectedPatient?.name || '________________'}</span>
                  </div>
                  
                  <div className={`whitespace-pre-line ${paperSize === 'a4' ? 'text-sm' : 'text-[10px]'} text-slate-800 leading-relaxed font-serif min-h-[200px]`}>
                    {prescription || 'Prescreva as orientações médicas...'}
                  </div>
                </div>
             </div>

             <div className="mt-10 flex flex-col items-center">
                <div className="w-56 border-t border-slate-300 pt-2 text-center">
                  <p className="text-sm font-bold">{selectedDoctor?.name || 'Dr. Responsável'}</p>
                  <p className="text-[10px] text-slate-500 uppercase">CRM: {selectedDoctor?.crm || '00000'}</p>
                </div>
                <div className="mt-4 text-[9px] text-slate-300 flex justify-between w-full">
                   <span>DATA: {new Date().toLocaleDateString()}</span>
                   <span>REF: {Math.floor(Math.random()*10000)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Versão PDF (Hidden) */}
      <div className="hidden">
        <div ref={printRef} className={`paper-${paperSize} mx-auto bg-white flex flex-col justify-between`} style={{ width: paperSize === 'a4' ? '210mm' : '148.5mm', height: paperSize === 'a4' ? '297mm' : '210mm', padding: '15mm', boxSizing: 'border-box' }}>
           <div className="space-y-10">
              <div className="text-center space-y-2 border-b-2 pb-6">
                 {docHeader.logo && <img src={docHeader.logo} className="h-14 mx-auto mb-4" alt="Logo" />}
                 <h1 className="text-2xl font-bold uppercase">{docHeader.name}</h1>
                 <div className="text-sm text-slate-600 space-y-1">
                   <p>{docHeader.address}</p>
                   <p>Tel: {docHeader.phone}</p>
                   <p className="text-xs text-slate-500">CNPJ: {docHeader.cnpj}</p>
                 </div>
              </div>
              
              <div className="flex justify-between items-end border-b pb-2">
                 <h2 className="text-2xl font-serif font-bold italic">Prescrição Médica</h2>
                 <p className="text-sm">Paciente: <span className="font-bold">{selectedPatient?.name}</span></p>
              </div>

              <div className="whitespace-pre-line font-serif leading-loose text-xl min-h-[400px]">
                {prescription}
              </div>
           </div>

           <div className="flex flex-col items-center pb-8">
              <div className="w-72 border-t-2 border-slate-900 pt-4 text-center">
                <p className="text-xl font-bold">{selectedDoctor?.name}</p>
                <p className="text-sm">CRM {selectedDoctor?.crm} - {selectedDoctor?.specialty}</p>
              </div>
              <p className="mt-8 text-[9px] text-slate-400">{docHeader.address} | Tel: {docHeader.phone}</p>
           </div>
        </div>
      </div>

      {/* Print Version */}
      <div className="print-only">
        <div className={`paper-${paperSize} mx-auto bg-white flex flex-col justify-between h-full`}>
           <div className="space-y-10">
              <div className="text-center space-y-2 border-b-2 pb-6">
                 {docHeader.logo && <img src={docHeader.logo} className={`${paperSize === 'a4' ? 'h-16' : 'h-12'} mx-auto mb-4`} alt="Logo" />}
                 <h1 className={`${paperSize === 'a4' ? 'text-2xl' : 'text-xl'} font-bold uppercase`}>{docHeader.name}</h1>
                 <div className={`${paperSize === 'a4' ? 'text-sm' : 'text-xs'} text-slate-600 space-y-1`}>
                    <p>{docHeader.address}</p>
                    <p>Tel: {docHeader.phone}</p>
                    <p className="text-[10px] text-slate-500">CNPJ: {docHeader.cnpj}</p>
                 </div>
              </div>
              
              <div className="flex justify-between items-end border-b pb-2">
                 <h2 className={`${paperSize === 'a4' ? 'text-2xl' : 'text-xl'} font-serif font-bold italic`}>Prescrição Médica</h2>
                 <p className={`${paperSize === 'a4' ? 'text-sm' : 'text-xs'}`}>Paciente: <span className="font-bold">{selectedPatient?.name}</span></p>
              </div>

              <div className={`whitespace-pre-line font-serif leading-loose ${paperSize === 'a4' ? 'text-xl' : 'text-lg'} min-h-[400px]`}>
                {prescription}
              </div>
           </div>

           <div className="flex flex-col items-center pb-8">
              <div className={`${paperSize === 'a4' ? 'w-72' : 'w-56'} border-t-2 border-slate-900 pt-4 text-center`}>
                <p className={`${paperSize === 'a4' ? 'text-xl' : 'text-lg'} font-bold`}>{selectedDoctor?.name}</p>
                <p className="text-sm">CRM {selectedDoctor?.crm} - {selectedDoctor?.specialty}</p>
              </div>
              <p className="mt-6 text-[9px] text-slate-400">{docHeader.address} | Tel: {docHeader.phone}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
