import Diary from "./diary";
import { DiaryEntry } from "../../../backend/src/types";
interface data{
    Diaries:DiaryEntry[]
}
const Diaries=(props:data)=>{
    return(props.Diaries.map(diary=><Diary {...diary}></Diary>))
}

export default Diaries