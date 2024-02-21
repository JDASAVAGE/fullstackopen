import { useState } from 'react'
const Button=(props)=>(
  <button onClick={props.handleClick}>{props.text}</button>
)
const Display =(props)=>{
  var x= (Math.max(...props.votes))
  var y=props.votes.indexOf(x)
  console.log(Math.max(...props.votes))
  console.log(y)
  return(
    <>
    <div>{props.anecdotes[y]} </div></>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const[votes,setVotes]= useState(Array(anecdotes.length).fill(0))
  console.log(votes)
  
  const handleClick= ()=>{
    var x= Math.floor(Math.random()*8)
    setSelected(x)
    console.log(x)
  }

  const handleVote=()=>{
    const duplicate= [...votes]
    duplicate[selected]++
    setVotes(duplicate)
  }
 
  return (
    <>
    <h1>Anecdote of the day</h1>
    <div>
      {anecdotes[selected]}
    </div>
    <div>has {votes[selected]} votes</div>
    <Button handleClick={handleVote} text="vote"/>
    <Button handleClick={handleClick} text="next anecdote"/>
    <h2>Anecdote with the most votes</h2>
    <Display anecdotes={anecdotes} votes={votes}/>
    </>
  )
}

export default App