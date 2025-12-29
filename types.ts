
export type UserRole = 'ADMIN' | 'USER' | 'VIEWER';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

export interface SurgicalRecord {
  id: string;
  timestamp: string;
  startTime: string;
  endTime: string;
  hospitalNumber: string;
  patientName: string;
  ward: string;
  department: string;
  surgeon: string;
  assistant1: string;
  assistant2: string;
  anesthesiologist: string;
  anesthesiaType: string;
  surgicalNurse: string;
  clinicalDiagnosis: string;
  postOpDiagnosis: string;
  operativeProcedure: string;
  position: string;
  incision: string;
  operativeNote: string;
  bloodLoss: string;
  specimen: string;
  complications: string;
  woundClassification: '1' | '2' | '3' | '4';
  epidural: boolean;
  aLine: boolean;
  centralLine: boolean;
  foleyCatheter: boolean;
  hairRemoved: boolean;
  antibiotic: string;
  skinScrub: boolean;
  skinAntiseptic: boolean;
  bloodTransfusion: string;
  image1Url: string;
  image2Url: string;
}

export interface AutocompleteOption {
  value: string;
  label: string;
}
