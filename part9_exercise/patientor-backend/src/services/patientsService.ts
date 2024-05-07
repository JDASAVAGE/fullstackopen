import patientsData from '../../data/patients';
import { Patient,Patientwithoutsensitive,newPatient } from '../types';
import { v1 as uuid } from 'uuid';

const patients:Patient[]=patientsData as Patient[];
const getPatients=():Patient[]=>{
    return patients;
};

const getNonSensitiveEntries = (): Patientwithoutsensitive[] => {
    return patientsData.map(({ id, name, dateOfBirth, gender, occupation,}) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const getSingularPatient=(id:string):Patient|undefined=>{
    return patientsData.find(patient=>patient.id==id);
};

const createNewPatient=(patient:newPatient):Patient=>{
    const newId: string = uuid();
    const newP={...patient,id:newId,entries:[]};
    patientsData.push(newP);
    return newP;
};

export default{getPatients,getNonSensitiveEntries,createNewPatient,getSingularPatient};