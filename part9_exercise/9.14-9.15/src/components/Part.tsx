import { Partprops } from "../types"
const Part=(props:Partprops)=>{
    switch(props.coursePart.kind){
        case "basic":
            return(
                <>
                <i>{props.coursePart.description}</i>
                </>
            )
        case "background":
            return(
                <>
                <i>{props.coursePart.description}</i><br/>
                <i>{props.coursePart.backgroundMaterial}</i>
                </>
            )
        case "group":
            return(
                <>
                <i>project exercises {props.coursePart.groupProjectCount}</i>
                </>
            )
        case "special":
            return(<>
             <i>{props.coursePart.description}</i><br/>
             <i>{props.coursePart.requirements.join( ", ")}</i>
            </>)
    }
}

export default Part