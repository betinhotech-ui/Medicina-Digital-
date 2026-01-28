
import React from 'react';
import { Save, Upload, Info } from 'lucide-react';
import { ClinicSettings } from '../types';

interface SettingsProps {
  settings: ClinicSettings;
  setSettings: (settings: ClinicSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h1>
        <p className="text-slate-500">Personalize os dados da sua clínica ou hospital para os documentos oficiais</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-4 flex-shrink-0">
              <label className="text-sm font-semibold text-slate-700">Logo da Unidade</label>
              <div className="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group overflow-hidden">
                {settings.logo ? (
                   <img src={settings.logo} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <Upload className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
                    <span className="text-[10px] text-slate-400 font-medium mt-2">Upload Logo</span>
                  </>
                )}
              </div>
              <input 
                type="text" 
                placeholder="URL da Imagem Logo" 
                name="logo" 
                value={settings.logo}
                onChange={handleChange}
                className="w-full text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded outline-none"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nome da Clínica/Hospital</label>
                <input 
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">CNPJ</label>
                <input 
                  type="text"
                  name="cnpj"
                  value={settings.cnpj}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Telefone para Contato</label>
                <input 
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Administrativo</label>
                <input 
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Endereço Completo</label>
                <textarea 
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
            <Info className="text-blue-500 flex-shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              As informações acima serão utilizadas automaticamente no cabeçalho e rodapé de todos os documentos gerados pelo sistema, garantindo conformidade e profissionalismo.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center space-x-2 font-bold">
            <Save size={20} />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </div>
    </div>
  );
};
