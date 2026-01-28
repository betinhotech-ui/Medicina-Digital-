
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, Hospital as HospitalIcon, X } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalListProps {
  hospitals: Hospital[];
  onAdd: (hospital: Hospital) => void;
  onUpdate: (hospital: Hospital) => void;
  onDelete: (id: string) => void;
}

export const HospitalList: React.FC<HospitalListProps> = ({ hospitals, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Hospital>>({});

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.cnpj.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.cnpj) {
      if (editingId) {
        onUpdate({
          ...formData,
          id: editingId,
        } as Hospital);
      } else {
        onAdd({
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        } as Hospital);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (hospital: Hospital) => {
    setFormData(hospital);
    setEditingId(hospital.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospitais e Unidades</h1>
          <p className="text-slate-500">Gerencie as unidades de atendimento do seu sistema</p>
        </div>
        <button 
          onClick={() => { if(showForm && !editingId) setShowForm(false); else { resetForm(); setShowForm(true); } }}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center space-x-2 font-medium"
        >
          {showForm && !editingId ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm && !editingId ? 'Fechar' : 'Nova Unidade'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl border border-indigo-200 shadow-sm ring-4 ring-indigo-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              {editingId ? `Editando Unidade: ${formData.name}` : 'Cadastrar Novo Hospital/Clínica'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nome da Unidade</label>
              <input 
                type="text" required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">CNPJ</label>
              <input 
                type="text" required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.cnpj || ''}
                onChange={e => setFormData({...formData, cnpj: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Telefone</label>
              <input 
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.phone || ''}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Endereço Completo</label>
              <input 
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.address || ''}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">URL da Logo (Opcional)</label>
              <input 
                type="text"
                placeholder="https://exemplo.com/logo.png"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={formData.logo || ''}
                onChange={e => setFormData({...formData, logo: e.target.value})}
              />
            </div>
            <div className="flex items-end gap-2 md:col-span-3">
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
              >
                {editingId ? 'Atualizar Unidade' : 'Salvar Unidade Hospitalar'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar hospital ou CNPJ..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Hospital / Unidade</th>
                <th className="px-6 py-4 font-semibold">CNPJ</th>
                <th className="px-6 py-4 font-semibold">Localização</th>
                <th className="px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHospitals.map((hospital) => (
                <tr key={hospital.id} className={`hover:bg-slate-50/50 transition-colors ${editingId === hospital.id ? 'bg-indigo-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {hospital.logo ? (
                          <img src={hospital.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <HospitalIcon className="text-indigo-600" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{hospital.name}</p>
                        <p className="text-xs text-slate-500">{hospital.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{hospital.cnpj}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate">{hospital.address}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => startEdit(hospital)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(hospital.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
