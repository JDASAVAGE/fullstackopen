interface Result {
    periodLength: number;
    trainingDays: number;
    success:boolean;
    ratingDescription:string;
    target:number;
    average:number;
    rating:number
  }

const calculateExercises= (input:number[]):Result=>{
    const average=input.reduce((total, currentValue) => total + currentValue, 0)/input.length;
    const success=average>=3;
    const trainingDays=input.filter(day=>day>0).length;
    let rating=0;
    if (trainingDays>=5 && success){
        rating=3;
    }
    else if (trainingDays>=5 || success){
        rating=2;
    }
    else{
        rating=1;
    }

    return({
        periodLength:input.length,
        trainingDays:trainingDays,
        average:average,
        target:3,
        success:success,
        ratingDescription:success?"Good Job you achieved your goal":"Although you didn't hit your goal this time, don't give up!",
        rating:rating
    });

};

export default calculateExercises;
console.log(calculateExercises(process.argv.slice(2).map(Number)));