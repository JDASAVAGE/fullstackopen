import { useState } from "react";
import {Link,useParams } from "react-router-dom";
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import axios from 'axios';

import { PatientFormValues, Patient,Diagnosis,Entry } from "../../types";
import AddPatientModal from "../AddPatientModal";

import HealthRatingBar from "../HealthRatingBar";

import patientService from "../../services/patients";
import patients from "../../services/patients";

interface Props {
  patients : Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}
interface Prop{
  patients:Patient[],
  diagnosis:Diagnosis[],
}
interface Ent{
  entry:Entry
}
const Part=(props:Ent)=>{
  switch(props.entry.type){
      case "HealthCheck":
          return(
              <>
              <i>Health check rating: {props.entry.healthCheckRating}</i>
              </>
          );
      case "Hospital":
          return(
              <>
              <i>Date of discharge: {props.entry.discharge.date}</i><br/>
              <i>Discharge condition: {props.entry.discharge.criteria}</i>
              </>
          );
      case "OccupationalHealthcare":
          return(
              <>
              <i>Employer: {props.entry.employerName}</i>
              </>
          );
  }
};
export const P=(props:Prop)=>{
  const {id} =useParams<{ id: string }>();
  const patient=props.patients.find(patient=>patient.id==id);
  return(
    <>
    <h1><strong>{patient?.name}</strong></h1>
    <br/>
    <h4>ssn: {patient?.ssn}</h4>
    <h4>occupation: {patient?.occupation}</h4>

    <h3>Entries</h3>
    {patient?.entries.map(entry=>(<div><h4>{entry.date} {entry.description}</h4>
    <ul>{entry.diagnosisCodes?.map(code=><li>{code} {props.diagnosis.find(diagnosis=>diagnosis.code==code)?.name}</li>)}</ul>
    <br/><Part entry={entry}></Part></div>))}
    </>
  );
};

const PatientListPage = ({ patients, setPatients } : Props ) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient));
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patients).map((patient: Patient) => (
            <TableRow key={patient.id}>
              <TableCell><Link to={`/patients/${patient.id}`}>{patient.name}</Link></TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
