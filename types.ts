
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  status: 'PAGO' | 'PENDENTE';
  amount: number;
}

export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  email: string;
  phone: string;
}

export interface Hospital {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  logo?: string;
}

export interface ClinicSettings {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  logo: string;
  email: string;
}

export type View = 'DASHBOARD' | 'PATIENTS' | 'DOCTORS' | 'HOSPITALS' | 'CERTIFICATE' | 'PRESCRIPTION' | 'SETTINGS';
