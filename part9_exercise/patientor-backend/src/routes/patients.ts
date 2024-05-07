/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient } from '../utilis';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send((patientsService.getPatients()));
});

router.get('/:id',(req,res)=>{
  res.send(patientsService.getSingularPatient(req.params.id));}
);

router.post('/',(req,res)=>{
    const newP =toNewPatient(req.body);
    const addedPatient=patientsService.createNewPatient(newP);
    
    res.json(addedPatient);
});


export default router;