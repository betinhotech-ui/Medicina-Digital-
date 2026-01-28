
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, UserSquare, X } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorListProps {
  doctors: Doctor[];
  onAdd: (doctor: Doctor) => void;
  onUpdate: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
}

export const DoctorList: React.FC<DoctorListProps> = ({ doctors, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Doctor>>({});

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.crm && formData.specialty) {
      if (editingId) {
        onUpdate({
          ...formData,
          id: editingId,
        } as Doctor);
      } else {
        onAdd({
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        } as Doctor);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (doctor: Doctor) => {
    setFormData(doctor);
    setEditingId(doctor.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Corpo Clínico</h1>
          <p className="text-slate-500">Gerencie os médicos e profissionais da sua unidade</p>
        </div>
        <button 
          onClick={() => { if(showForm && !editingId) setShowForm(false); else { resetForm(); setShowForm(true); } }}
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-200 flex items-center space-x-2 font-medium"
        >
          {showForm && !editingId ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm && !editingId ? 'Fechar' : 'Novo Médico'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl border border-sky-200 shadow-sm ring-4 ring-sky-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              {editingId ? `Editando Dr(a). ${formData.name}` : 'Cadastrar Novo Médico'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
              <input 
                type="text" required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">CRM (Ex: SP 123456)</label>
              <input 
                type="text" required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none"
                value={formData.crm || ''}
                onChange={e => setFormData({...formData, crm: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Especialidade</label>
              <input 
                type="text" required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none"
                value={formData.specialty || ''}
                onChange={e => setFormData({...formData, specialty: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Profissional</label>
              <input 
                type="email"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none"
                value={formData.email || ''}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Telefone</label>
              <input 
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none"
                value={formData.phone || ''}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="flex items-end gap-2">
              <button 
                type="submit"
                className="flex-1 bg-sky-600 text-white py-2.5 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-md"
              >
                {editingId ? 'Atualizar Profissional' : 'Salvar Médico'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
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
              placeholder="Buscar por nome, CRM ou especialidade..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Médico</th>
                <th className="px-6 py-4 font-semibold">CRM</th>
                <th className="px-6 py-4 font-semibold">Especialidade</th>
                <th className="px-6 py-4 font-semibold">Contato</th>
                <th className="px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className={`hover:bg-slate-50/50 transition-colors ${editingId === doctor.id ? 'bg-sky-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center font-bold">
                        <UserSquare size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{doctor.name}</p>
                        <p className="text-xs text-slate-400">ID: {doctor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm font-medium">{doctor.crm}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                      {doctor.specialty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    <p>{doctor.email}</p>
                    <p className="text-xs text-slate-400">{doctor.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => startEdit(doctor)}
                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(doctor.id)}
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
