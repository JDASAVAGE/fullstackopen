const Header=(props)=>{
  
  return(
  <>
    <h1>{props.course}</h1>
  
  </>
  )
}
const Part=(props)=>{
  
  return(
  <>
    <p>{props.part} {props.exercises}
    </p>
  </>
  )
}
const Content=(props)=>{
  console.log("Mission Success")
  return(
    <>
    <Part part={props.lol[0].name} exercises={props.lol[0].exercises}/>
    <Part part={props.lol[1].name} exercises={props.lol[1].exercises}/>
    <Part part={props.lol[2].name} exercises={props.lol[2].exercises}/>
    </>
  )
}

const Total= (props)=>{
 console.log("Mission Success")
 return(
 <>
  <p>Number of exercises {props.lol[0].exercises + props.lol[1].exercises + props.lol[2].exercises}</p>
  </>
 )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name} />
      <Content lol={course.parts}/>
      <Total lol={course.parts} />
      </div>
  )
}

export default App
