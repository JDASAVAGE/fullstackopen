import { useState,useEffect} from 'react'
import countryService from './services/countries'
const Search=({value,handleChange})=>{
  return(
  <>
  <div> find countries <input onChange={handleChange} value={value}/> 
  </div>
  </>)
}
const Notification=({message})=>{
  if (message===null)
  {return null}
  return (
    <div>
      {message}
    </div>
  )
}
const Display=({display,setCountry,setDisplay})=>{
  if (display===null)
  {return null}
  return(<>
    {display.map((country,index)=><div key={index}>{country}<button onClick={()=>setCountry([country])+setDisplay(null)}>show</button></div>)}
    </>
  )
}
const Showcase=({country,data})=>{
  if (country===null)
  {return null} 
  var nation=data.find(nation=>nation.name.common==country[0])
  console.log(nation)
  return(
    <>
    <h1>{nation.name.common}</h1>
    <div>capital {nation.capital}</div>
    <div>area {nation.area}</div>
    <h2>languages: </h2>    
    <ul>
      {Object.values(nation.languages).map((language,index)=><li key={index}>{language}</li>)}
    </ul>
    <img style={{ width:200, height: 200 }} src={nation.flags.png}/>
    </>
  )
}
function App() {
  const [value, setValue] = useState('')
  const[notification,setNotification]=useState(null)
  const[display,setDisplay]=useState([])
  const[data,setData]=useState([])
  const[country,setCountry]=useState(null)
  const[dataFetched,setDataFetched]=useState(false)
  useEffect(()=>{ 
  countryService
  .getAll()
  .then(returnedCountries=>{setData(returnedCountries),setDataFetched(true)})},[])
  if (!dataFetched) {
    return <div>Loading...</div>;
  }
  const handleChange=(event)=>{
    setCountry(null)
    setNotification(null)
    setDisplay(null)
    console.log(event.target.value)
    var x= event.target.value
    setValue(x)
    if (x){
    var countries=data.map(country=>country.name.common)
    var filteredCountries=countries.filter(country=>country.toLowerCase().includes(x.toLowerCase()))
      console.log(filteredCountries)
      if(filteredCountries.length>10)
      {setNotification('Too many matches, specify another filter')}
      else if(filteredCountries.length==1)
      {setCountry(filteredCountries)

      }
      else{setDisplay(filteredCountries)}
    }
  }
  return (
    <>
     <Search value={value} handleChange={handleChange}/>
     <Notification message={notification}/>
     <Display display={display} setCountry={setCountry}setDisplay={setDisplay}/>
     <Showcase country={country} data={data} />
    </>
  )
}

export default App
