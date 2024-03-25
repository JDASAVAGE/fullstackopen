import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from "./NotificationContext"
import { useContext } from 'react'
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import { getAnecdotes,createAnecdote,addVote} from './requests'
const App = () => {
  const[notification,dispatch]=useContext(NotificationContext)
  const queryClient=useQueryClient()
  const newAnecdoteMutation = useMutation({ mutationFn:createAnecdote,
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  },
  onError:()=>{ 
    dispatch({type:'ERROR',payload:{}})
    setTimeout(() => {
    dispatch({type:'BLANK',payload:{}})
  }, 5000)

  },  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    var response=newAnecdoteMutation.mutate({content})
    console.log(response)
    dispatch({type:'ADD',payload:{anecdote:content}})
    setTimeout(() => {
      dispatch({type:'BLANK',payload:{}})
    }, 5000)

}
const updateAnecdoteMutation = useMutation({ mutationFn:addVote,
  onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
},  })
  const handleVote = (anecdote) => {
    const content={...anecdote,votes:anecdote.votes?anecdote.votes+1:1}
    console.log(content)
    updateAnecdoteMutation.mutate(content)
    dispatch({type:'VOTE',payload:{anecdote:content.content}})
    setTimeout(() => {
      dispatch({type:'BLANK',payload:{}})
    }, 5000)
  }
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry:false
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if(result.isError){
    return <span>anecdote service not available due to problems in server </span>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm onCreate={onCreate}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
