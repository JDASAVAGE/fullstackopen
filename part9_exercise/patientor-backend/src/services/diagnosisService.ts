import diagnosesData from '../../data/diagnoses';
import { Diagnoses } from "../types";

const diagnoses:Diagnoses[]=diagnosesData as Diagnoses[];
const getDiagnoses = (): Diagnoses[] => {
    return diagnoses;
  };

  export default{
    getDiagnoses
  };

  