import { useState,useEffect } from 'react'
import axios from 'axios';
import diariesService from "./services/diaries";
import Diaries from './components/diaries';
import { DiaryEntry,NewDiaryEntry, Visibility, Weather  } from '../../backend/src/types';


function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDiary, setNewDiary] = useState<NewDiaryEntry>({} as NewDiaryEntry);
  const[errormsg,setErrormsg]=useState<string|null>(null);

  useEffect(()=>{diariesService.getAllDiaries().then(data=>setDiaries(data))},[])
  const Submit=async (event:React.SyntheticEvent)=>{
    event.preventDefault()
    try{
    const diary= await diariesService.addDiary(newDiary)
    setNewDiary({} as NewDiaryEntry)
    setDiaries(diaries.concat(diary))
    setErrormsg(null)
  }
    catch(error){
      if (axios.isAxiosError(error)) {
        setErrormsg(error.response?.data as string);
      } else {
        setErrormsg("An error occurred. Please try again");
      }

    }

    
}
  if(diaries.length==0){
    return(<><p>Retrieving data from servers...</p></>)
  }
  const headerStyle={
    color: 'Red',
    fontSize: 20,
    padding: 10,
    marginBottom: 10
  }
  return (
    <>
    <h1>Diary Entries</h1>
      <Diaries Diaries={diaries}></Diaries>
      <h1>Add New Entries</h1>
      {errormsg === null ?
        null :
        <div className="notification" style={headerStyle}>
          {errormsg}
        </div>}
      
      <form onSubmit={Submit}>
        <input value={newDiary.date} onChange={(e) => setNewDiary({...newDiary, date: e.target.value,} )}type="date" name="date"></input>
        <br/>
        <input type="radio" id="great" name="visibility" value="great"onChange={(event) =>setNewDiary({...newDiary,visibility: event.target.value as Visibility})}/>
        <label htmlFor='great'>great</label>
        <input type="radio" id="good" name="visibility"  value="good" onChange={(event) =>setNewDiary({...newDiary,visibility: event.target.value as Visibility})}/>
        <label htmlFor="good">good</label>
        <input type="radio" id="okay" name="visibility"  value="okay" onChange={(event) =>setNewDiary({...newDiary,visibility: event.target.value as Visibility})}/>
        <label htmlFor="okay">okay</label>
        <input type="radio" id="poor" name="visibility"  value="poor" onChange={(event) =>setNewDiary({...newDiary,visibility: event.target.value as Visibility})}/>
        <label htmlFor="poor">poor</label>
        <br/>
        <input type="radio" id="sunny" name="weather" value="sunny" onChange={(event) =>setNewDiary({...newDiary,weather: event.target.value as Weather})}/>
        <label htmlFor='sunny'>sunny</label>
        <input type="radio" id="rainy" name="weather" value="rainy" onChange={(event) =>setNewDiary({...newDiary,weather: event.target.value as Weather})}/>
        <label htmlFor='rainy'>rainy</label>
        <input type="radio" id="cloudy" name="weather" value="cloudy" onChange={(event) =>setNewDiary({...newDiary,weather: event.target.value as Weather})}/>
        <label htmlFor='cloudy'>cloudy</label>
        <input type="radio" id="stormy" name="weather" value="stormy" onChange={(event) =>setNewDiary({...newDiary,weather: event.target.value as Weather})}/>
        <label htmlFor='stormy'>stormy</label>
        <input type="radio" id="windy" name="weather" value="windy" onChange={(event) =>setNewDiary({...newDiary,weather: event.target.value as Weather})}/>
        <label htmlFor='windy'>windy</label>
        <br/>
        <input type='text' name='comment' value={newDiary.comment} onChange={(event) =>setNewDiary({...newDiary,comment: event.target.value})}></input>
        <br/>
        <button type='submit'>add</button>
        </form>
      
    </>
  )
}

export default App
