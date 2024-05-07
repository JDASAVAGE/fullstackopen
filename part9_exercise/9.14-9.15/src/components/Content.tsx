import Part from "./Part";
import { Content } from "../types";
const Conten=(props:Content)=>{
    return(
        props.courseParts.map(course=><><p><strong>{course.name} {course.exerciseCount}</strong></p><Part coursePart={course}></Part><br/></>)
    )
}

export default Conten