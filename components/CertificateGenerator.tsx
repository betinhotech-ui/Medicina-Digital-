
import React, { useState, useRef } from 'react';
import { FileText, Printer, Sparkles, Building2, Download, Loader2, Wand2 } from 'lucide-react';
import { ClinicSettings, Patient, Doctor, Hospital } from '../types';
import { generateProfessionalCertificate } from '../services/geminiService';

interface CertificateGeneratorProps {
  settings: ClinicSettings;
  patients: Patient[];
  doctors: Doctor[];
  hospitals: Hospital[];
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ settings, patients, doctors, hospitals }) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [days, setDays] = useState('1');
  const [diagnosis, setDiagnosis] = useState('');
  const [observations, setObservations] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerateAI = async () => {
    if (!diagnosis) {
      alert("Por favor, informe o quadro clínico ou diagnóstico.");
      return;
    }
    setIsGenerating(true);
    const generated = await generateProfessionalCertificate(diagnosis, observations, days);
    if (generated) {
      setFinalText(generated);
    }
    setIsGenerating(false);
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
      filename: `Atestado_${selectedPatient.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: paperSize, orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o PDF. Tente usar a opção de imprimir.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Emissor de Atestados Inteligente</h1>
          <p className="text-slate-500">Gere textos profissionais automaticamente com IA</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-white p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setPaperSize('a4')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${paperSize === 'a4' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                A4
              </button>
              <button 
                onClick={() => setPaperSize('a5')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${paperSize === 'a5' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                A5
              </button>
           </div>
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading || !selectedPatient}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-2 font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            <span>Baixar PDF</span>
          </button>
          <button 
            onClick={handlePrint}
            className="bg-slate-800 text-white p-2.5 rounded-xl hover:bg-slate-900 transition-all shadow-md"
            title="Imprimir"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <FileText className="text-blue-600" size={20} />
            <span>Dados Clínicos</span>
          </h2>
          
          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" />
                Unidade Hospitalar
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={hospitalId}
                onChange={e => setHospitalId(e.target.value)}
              >
                <option value="">Clínica Principal (Configurações)</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Paciente</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                >
                  <option value="">Selecione o paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Médico Responsável</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
                >
                  <option value="">Selecione o médico</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Quadro Clínico / Diagnóstico (Opcional p/ IA)</label>
              <input 
                type="text"
                placeholder="Ex: Gripe Forte, CID J11, Dor Lombar..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Dias de Afastamento</label>
                <input 
                  type="number"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={days}
                  onChange={e => setDays(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Observações Adicionais</label>
                <input 
                  type="text"
                  placeholder="Ex: Repouso absoluto, Dieta leve..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleGenerateAI}
              disabled={isGenerating || !diagnosis}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
              <span>Gerar Texto Profissional com IA</span>
            </button>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-800">Conteúdo Final do Atestado</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2.5 bg-blue-50/30 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-serif italic text-slate-700"
                placeholder="O texto gerado pela IA aparecerá aqui e você poderá editar..."
                value={finalText}
                onChange={e => setFinalText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-slate-100 p-8 rounded-2xl flex items-start justify-center overflow-auto min-h-[600px]">
          <div className={`bg-white shadow-2xl p-10 flex flex-col justify-between border-t-4 border-blue-600 transition-all ${paperSize === 'a4' ? 'w-full max-w-[500px] min-h-[650px]' : 'w-full max-w-[350px] min-h-[450px]'}`}>
             <div className="space-y-8">
                <div className="text-center space-y-2 border-b border-slate-100 pb-6">
                  {docHeader.logo && <img src={docHeader.logo} className="h-10 mx-auto mb-2 grayscale opacity-80" alt="Logo" />}
                  <h3 className={`${paperSize === 'a4' ? 'text-lg' : 'text-sm'} font-bold text-slate-800 uppercase tracking-widest`}>{docHeader.name}</h3>
                  <div className="text-[8px] text-slate-400 font-medium leading-tight space-y-0.5">
                    <p>CNPJ: {docHeader.cnpj}</p>
                    <p>{docHeader.address}</p>
                    <p>Tel: {docHeader.phone}</p>
                  </div>
                </div>

                <div className="text-center py-2">
                  <h2 className={`${paperSize === 'a4' ? 'text-xl' : 'text-lg'} font-serif font-bold text-slate-900 underline underline-offset-8 decoration-blue-200`}>ATESTADO MÉDICO</h2>
                </div>

                <div className={`text-slate-800 leading-relaxed font-serif text-justify px-2 ${paperSize === 'a4' ? 'text-sm' : 'text-xs'}`}>
                  {finalText ? (
                    <div className="whitespace-pre-line">
                      <p className="indent-6">
                        Atesto para os devidos fins que o(a) Sr(a). <strong>{selectedPatient?.name || '________________'}</strong>, 
                        inscrito(a) no CPF sob o nº <strong>{selectedPatient?.cpf || '000.000.000-00'}</strong>, foi atendido(a) nesta unidade 
                        de saúde nesta data.
                      </p>
                      <p className="mt-4">{finalText}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center py-10">Preencha os dados e clique em "Gerar Texto Profissional" para visualizar o atestado.</p>
                  )}
                </div>
             </div>

             <div className="mt-10 flex flex-col items-center">
                <div className="w-full max-w-[200px] border-t border-slate-400 pt-2 text-center">
                  <p className="text-slate-900 font-bold text-sm">{selectedDoctor?.name || 'Dr. Responsável'}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-tighter">CRM: {selectedDoctor?.crm || '00000'} - {selectedDoctor?.specialty || 'ESPECIALIDADE'}</p>
                </div>
                <p className="mt-4 text-[8px] text-slate-300">Autenticado pelo Sistema Medicina Digital.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Versão para PDF (Escondida na UI, mas usada pelo html2pdf) */}
      <div className="hidden">
        <div ref={printRef} className={`paper-${paperSize} mx-auto bg-white flex flex-col justify-between`} style={{ width: paperSize === 'a4' ? '210mm' : '148.5mm', height: paperSize === 'a4' ? '297mm' : '210mm', padding: '20mm', boxSizing: 'border-box' }}>
          <div className="space-y-12">
            <div className="text-center space-y-4 border-b pb-8">
              {docHeader.logo && <img src={docHeader.logo} className="h-16 mx-auto mb-4 grayscale" alt="Logo" />}
              <h1 className="text-3xl font-bold uppercase tracking-widest">{docHeader.name}</h1>
              <div className="text-sm text-slate-600 leading-relaxed space-y-1">
                <p>CNPJ: {docHeader.cnpj}</p>
                <p>{docHeader.address}</p>
                <p>Tel: {docHeader.phone}</p>
              </div>
            </div>
            
            <h2 className="text-4xl text-center font-serif font-bold py-10 underline underline-offset-8 decoration-slate-200">ATESTADO MÉDICO</h2>
            
            <div className="text-xl leading-loose font-serif text-justify indent-12 space-y-8">
              <p>
                Atesto para os devidos fins que o(a) Sr(a). <strong>{selectedPatient?.name}</strong>, 
                inscrito(a) no CPF sob o nº <strong>{selectedPatient?.cpf}</strong>, foi atendido(a) nesta unidade de saúde na data de hoje.
              </p>
              <div className="whitespace-pre-line italic text-slate-700 leading-relaxed">
                {finalText}
              </div>
              <p className="pt-10 text-right">
                {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center pb-10">
            <div className="w-80 border-t-2 border-slate-900 pt-4 text-center">
              <p className="text-2xl font-bold">{selectedDoctor?.name}</p>
              <p className="text-sm text-slate-600">CRM {selectedDoctor?.crm} - {selectedDoctor?.specialty}</p>
            </div>
            <div className="mt-8 text-[10px] text-slate-400 text-center">
              <p>{docHeader.address} | Tel: {docHeader.phone}</p>
              <p>Gerado via Medicina Digital</p>
            </div>
          </div>
        </div>
      </div>

      {/* Versão para Impressão Nativa */}
      <div className="print-only">
        <div className={`paper-${paperSize} mx-auto bg-white flex flex-col justify-between h-full`}>
          <div className="space-y-12">
            <div className="text-center space-y-4 border-b pb-8">
              {docHeader.logo && <img src={docHeader.logo} className={`${paperSize === 'a4' ? 'h-16' : 'h-12'} mx-auto mb-4 grayscale`} alt="Logo" />}
              <h1 className={`${paperSize === 'a4' ? 'text-3xl' : 'text-2xl'} font-bold uppercase tracking-widest`}>{docHeader.name}</h1>
              <div className={`${paperSize === 'a4' ? 'text-sm' : 'text-xs'} text-slate-600 leading-relaxed space-y-1`}>
                <p>CNPJ: {docHeader.cnpj}</p>
                <p>{docHeader.address}</p>
                <p>Tel: {docHeader.phone}</p>
              </div>
            </div>
            
            <h2 className={`${paperSize === 'a4' ? 'text-4xl' : 'text-3xl'} text-center font-serif font-bold py-8 underline underline-offset-8 decoration-slate-200`}>ATESTADO MÉDICO</h2>
            
            <div className={`${paperSize === 'a4' ? 'text-xl' : 'text-lg'} leading-loose font-serif text-justify indent-12 space-y-8`}>
              <p>
                Atesto para os devidos fins que o(a) Sr(a). <strong>{selectedPatient?.name}</strong>, 
                inscrito(a) no CPF sob o nº <strong>{selectedPatient?.cpf}</strong>, foi atendido(a) na data de hoje.
              </p>
              <div className="whitespace-pre-line italic text-slate-700 leading-relaxed">
                {finalText}
              </div>
              <p className="pt-10 text-right">
                {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center pb-10">
            <div className={`${paperSize === 'a4' ? 'w-80' : 'w-64'} border-t-2 border-slate-900 pt-4 text-center`}>
              <p className={`${paperSize === 'a4' ? 'text-2xl' : 'text-xl'} font-bold`}>{selectedDoctor?.name}</p>
              <p className={`${paperSize === 'a4' ? 'text-sm' : 'text-xs'} text-slate-600`}>CRM {selectedDoctor?.crm} - {selectedDoctor?.specialty}</p>
            </div>
            <div className="mt-6 text-[9px] text-slate-400 text-center">
              <p>{docHeader.address} | Tel: {docHeader.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
