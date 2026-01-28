
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Patient } from '../types';

const data = [
  { name: 'Jan', revenue: 4000, visits: 240 },
  { name: 'Fev', revenue: 3000, visits: 198 },
  { name: 'Mar', revenue: 2000, visits: 150 },
  { name: 'Abr', revenue: 2780, visits: 210 },
  { name: 'Mai', revenue: 1890, visits: 120 },
  { name: 'Jun', revenue: 2390, visits: 170 },
];

interface DashboardProps {
  patients: Patient[];
}

export const Dashboard: React.FC<DashboardProps> = ({ patients }) => {
  const totalReceived = patients
    .filter(p => p.status === 'PAGO')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalPending = patients
    .filter(p => p.status === 'PENDENTE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { 
      label: 'Total Recebido', 
      value: `R$ ${totalReceived.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-emerald-500',
      trend: '+12.5%',
      isUp: true
    },
    { 
      label: 'Pagamentos Pendentes', 
      value: `R$ ${totalPending.toLocaleString()}`, 
      icon: Clock, 
      color: 'bg-amber-500',
      trend: '-2.4%',
      isUp: false
    },
    { 
      label: 'Total de Pacientes', 
      value: patients.length.toString(), 
      icon: Users, 
      color: 'bg-blue-500',
      trend: '+4.3%',
      isUp: true
    },
    { 
      label: 'Taxa de Conversão', 
      value: '78%', 
      icon: TrendingUp, 
      color: 'bg-indigo-500',
      trend: '+5.1%',
      isUp: true
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bem-vindo ao Medicina Digital</h1>
        <p className="text-slate-500">Visão geral da sua clínica hoje</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl shadow-lg shadow-slate-200`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div className={`flex items-center text-sm font-medium ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend}
                {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Receita Mensal</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Últimos Pacientes</h3>
          <div className="space-y-4">
            {patients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{patient.name}</h4>
                    <p className="text-xs text-slate-500">{patient.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    patient.status === 'PAGO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {patient.status}
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1">R$ {patient.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
