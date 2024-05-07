export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}
export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
interface discharge{
  date:string,
  criteria:string
}
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
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

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries:Entry[]

}

export type PatientFormValues = Omit<Patient, "id" | "entries">;