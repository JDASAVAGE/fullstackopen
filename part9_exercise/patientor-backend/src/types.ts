export interface Diagnoses{
    code:string;
    name:string;
    latin?:string;
}
export interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnoses['code']>;
  }
  export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
  }
  interface discharge{
    date:string,
    criteria:string
  }
  interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
  }
  interface OccupationalHealthcareEntry extends BaseEntry{
    type:'OccupationalHealthcare';
    employerName:string;
  }
  interface HospitalEntry extends BaseEntry{
    type:'Hospital';
    discharge:discharge;
  }
  export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface Patient{
    id:string;
    name:string;
    dateOfBirth:string;
    ssn:string;
    gender:string;
    occupation:string;
    entries:Entry[];
}

export type Patientwithoutsensitive= Omit<Patient, 'ssn'|'entries'>;
export type newPatient=Omit<Patient,'id'>;
export enum Gender { Male = "male", Female = "female", Other = "other" }