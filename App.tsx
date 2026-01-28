
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { HospitalList } from './components/HospitalList';
import { DoctorList } from './components/DoctorList';
import { CertificateGenerator } from './components/CertificateGenerator';
import { PrescriptionGenerator } from './components/PrescriptionGenerator';
import { Settings } from './components/Settings';
import { View, Patient, Doctor, Hospital, ClinicSettings } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State Management - Zeroed for fresh start
  const [patients, setPatients] = useState<Patient[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    logo: ''
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const updateHospital = (updatedHospital: Hospital) => {
    setHospitals(hospitals.map(h => h.id === updatedHospital.id ? updatedHospital : h));
  };

  const updateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(doctors.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
  };

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard patients={patients} />;
      case 'PATIENTS':
        return (
          <PatientList 
            patients={patients} 
            onAdd={(p) => setPatients([p, ...patients])}
            onUpdate={updatePatient}
            onDelete={(id) => setPatients(patients.filter(p => p.id !== id))}
          />
        );
      case 'DOCTORS':
        return (
          <DoctorList 
            doctors={doctors}
            onAdd={(d) => setDoctors([d, ...doctors])}
            onUpdate={updateDoctor}
            onDelete={(id) => setDoctors(doctors.filter(d => d.id !== id))}
          />
        );
      case 'HOSPITALS':
        return (
          <HospitalList 
            hospitals={hospitals}
            onAdd={(h) => setHospitals([h, ...hospitals])}
            onUpdate={updateHospital}
            onDelete={(id) => setHospitals(hospitals.filter(h => h.id !== id))}
          />
        );
      case 'CERTIFICATE':
        return (
          <CertificateGenerator 
            settings={clinicSettings} 
            patients={patients} 
            doctors={doctors}
            hospitals={hospitals}
          />
        );
      case 'PRESCRIPTION':
        return (
          <PrescriptionGenerator 
            settings={clinicSettings} 
            patients={patients} 
            doctors={doctors}
            hospitals={hospitals}
          />
        );
      case 'SETTINGS':
        return <Settings settings={clinicSettings} setSettings={setClinicSettings} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-lg">
               <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <span className="text-4xl">🛠️</span>
               </div>
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Módulo em Desenvolvimento</h2>
               <p className="text-slate-500">Estamos trabalhando para trazer esta funcionalidade em breve!</p>
               <button 
                 onClick={() => setView('DASHBOARD')}
                 className="mt-6 text-blue-600 font-bold hover:underline"
               >
                 Voltar ao Dashboard
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto no-print">
        <div className="max-w-7xl mx-auto pb-12">
          {renderView()}
        </div>
      </main>

      {/* Hidden container for print only components when they trigger via global print */}
      <div className="print-only">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
