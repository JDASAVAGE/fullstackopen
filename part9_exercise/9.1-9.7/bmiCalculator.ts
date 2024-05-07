const bmiCalculator=(weight:number,height:number,)=>{
    const bmi=weight/height**2;
    if (bmi<18.5){
        return "Abnormal (Underweight)";
    }
    else if (18.5<=bmi && bmi<=24.9){
        return "Normal (Healthy Weight)";
    }
    else{
        return "Abnormal (Overweight)";
    }
};

export default bmiCalculator;