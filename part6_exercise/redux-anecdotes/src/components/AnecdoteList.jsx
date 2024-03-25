import { useSelector, useDispatch } from 'react-redux'
import { placeVote } from '../reducers/anecdoteReducer'
import { notficationHandler } from '../reducers/notificationReducer'
const AnecdoteList=()=>{
    const anecdotes = useSelector(state => state.anecdotes)
    console.log(anecdotes)
    const filter=useSelector(state=>state.filter)
    const dispatch = useDispatch()
    return(
        <>
        {anecdotes.filter(anecdote=>anecdote.content.toLowerCase().includes(filter.toLowerCase())).sort(function(a,b){return b.votes-a.votes}).map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has {anecdote.votes}
                <button onClick={() =>{dispatch(placeVote(anecdote))
                                      dispatch(notficationHandler(`you voted ${anecdote.content}`,5))}}>
            vote</button>
              </div>
            </div>
          )}
             </>
    )
    
}
export default AnecdoteList