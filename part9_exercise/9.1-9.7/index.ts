import express = require('express');
import bmiCalculator from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi',(req,res)=>{
    if (req.query.height && req.query.weight) {
        const height = parseFloat(req.query.height as string);
        const weight = parseFloat(req.query.weight as string);
    res.send({bmi:bmiCalculator(weight,height),
    weight:weight,height:height+"m"});}
    else{
        res.send({error:"malformatted parameters"});
    }
});

app.post('/calculator',(req,res)=>{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    res.send(calculateExercises(req.body['input']));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});