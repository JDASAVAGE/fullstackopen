import { useDispatch } from "react-redux"
import { appendAnecdote } from "../reducers/anecdoteReducer"
import { notficationHandler } from "../reducers/notificationReducer"
const AnecdoteForm=()=>{
    const dispatch = useDispatch()
    const addAnecdote=async(event)=>{
        event.preventDefault()
        const content=event.target.anecdote.value
        event.target.anecdote.value=""
        dispatch(appendAnecdote(content))
        dispatch(notficationHandler("An anecdote has been added.",5))
      }
    return(<>
    <h2>create new</h2>
    <form onSubmit={addAnecdote}>
    <div><input name="anecdote" /></div>
    <button type="submit">create</button>
    </form></>
    )
}
export default AnecdoteForm