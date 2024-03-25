import{createSlice} from "@reduxjs/toolkit"
import anecdoteService from'../services/anecdotes'
const anecdoteSlice=createSlice({
  name:"anecdotes",
  initialState:[],
  reducers:{createAnecdote(state,action){
      const content=action.payload
      state.push(
        content)
    },
  handleVote(state,action){
    const id = action.payload
    const anecdoteToChange = state.find(n => n.id === id)
    const changedanecdote = { 
      ...anecdoteToChange, 
      votes: anecdoteToChange.votes+1 
  }
    return state.map(anecdote =>
      anecdote.id !== id ? anecdote : changedanecdote
    )},
  
  setAnecdotes(state, action) {
      return action.payload
    }   

  },
})

export const initializeanecdotes=()=>{
  return async dispatch=>{
    const anecdotes=await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }}

export const appendAnecdote=(content)=>{
  return async dispatch=>{
    const newAnecdote= await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}
export const placeVote=(update)=>{
  return async dispatch=>{
    const updatedAnecdote= await anecdoteService.update(update)
    dispatch(handleVote(updatedAnecdote.id))
  }

}

export const{handleVote,createAnecdote,setAnecdotes}=anecdoteSlice.actions
export default anecdoteSlice.reducer