import { DiaryEntry } from "../../../backend/src/types";
const Diary=(props:DiaryEntry)=>{
    return( 
        <>
        <h2><strong>{props.date}</strong></h2>
        <br/>
        <h3>{props.weather} </h3>
        <br/>
        <h3> Visibility: {props.visibility}</h3>
        <br/>
        <h3>{props.comment}</h3>
        </>
)
}

export default Diary