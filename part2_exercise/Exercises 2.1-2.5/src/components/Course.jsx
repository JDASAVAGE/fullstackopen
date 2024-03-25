const Header=(props)=>{
  
  return(
  <>
    <h1>{props.course.name}</h1>
  
  </>
  )
}

const Content=(props)=>{
  console.log("Mission Success")
  return(
    <>
     <div>
        {props.course.parts.map(part => <div key={part.id}>{part.name} {part.exercises}</div>)}
      </div>
    </>
  )
}

const Total= (props)=>{
  console.log("Mission Success")
  return(
  <>
   <div>Number of exercises {props.course.parts.reduce((sum,part)=>{return(sum+part.exercises)},0)}</div>
   </>
  )
 }

const Course=(props)=>{
  console.log(props)
  return(
    <>
  <Header course={props.lol}/>
  <Content course={props.lol}/>
  <Total course={props.lol}/>
   </>
  )
}
export default Course