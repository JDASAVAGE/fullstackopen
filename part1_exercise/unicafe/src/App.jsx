import { useState } from 'react'
const Button= (props) => (
  <button onClick={props.handleClick}>{props.text}
  </button>
)

const Header=(props)=> (
  <>
  <header>{props.info}</header>
  </>
)

const StatisticLine=(props)=> {
  return(
  <>
    <tr> 
    <td>{props.text} </td>
    <td>{props.value}</td>
    </tr>
  </>
  )
}
const Statistics=(props)=>{
  var view= props.view
  if (view>=1){
    return(
      <>
  <Header info="Statistics"/>
  <table>
  <tbody>
  <StatisticLine text='good' value={props.good}/>
  <StatisticLine text='neutral' value={props.neutral}/>
  <StatisticLine text='bad' value={props.bad}/>
  <StatisticLine text='all' value={props.total}/>
  <StatisticLine text='average' value={props.sum/props.total}/>
  <StatisticLine text='positive' value={props.calculate}/>
  </tbody>
  </table>
  </>
    )
  }
  return(
    <>
    <Header info="Statistics"/>
    <div>No feedback given</div>
    </>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const[total, setTotal]= useState(0)
  const[sum, setSum]= useState(0)
  const[view, setView]= useState(0)

  const handleGoodclick=()=>{
    setGood(good+1)
    setTotal(total+1)
    setSum(sum+1)
    setView(view+1)
  }

  const handleNeutralclick=()=>{
    setNeutral(neutral+1)
    setTotal(total+1)
    setView(view+1)
  }

  const handleBadclick =()=>{
    setBad(bad+1)
    setTotal(total+1)
    setSum(sum-1)
    setView(view+1)
  }
  const Calculatepercentage=()=>{
    var x= 100*good/total
    return `${x}%`
  }
  return (
    <div>
      <Header info="Give Feedback"/>
      <Button handleClick={handleGoodclick} text='good'/>
      <Button handleClick={handleNeutralclick} text='neutral'/>
      <Button handleClick={handleBadclick} text='bad'/>
      <Statistics view={view} good={good} neutral={neutral} bad={bad} total={total} sum={sum} calculate={Calculatepercentage()}/>
    </div>
  )
}

export default App