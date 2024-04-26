import { useState,useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Reccomendations from './components/Reccomendations'
import { gql, useQuery,useMutation,useApolloClient,useSubscription } from '@apollo/client'

const ALL_PERSONS = gql`
query {
  allAuthors {
    name
    born
  }
}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author{
      name
    }
  }
  }
`
const ALL_BOOKS=gql`
  query {
    allBooks {
      title
      published
      author{
        name
      }
      genres
    }
  }
  `

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const authors=useQuery(ALL_PERSONS)
  const [ login, result ] = useMutation(LOGIN)
  const client = useApolloClient()
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert('A book has been added.')
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
    }
  })
  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
    }
  }, [result.data])
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  if (!token) {
    return (
      <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
        <Authors authors={authors} show={page === 'authors'} />
        <Books show={page === 'books'} />
        <Login login={login} show={page==="login"}/>

      </div>
      </div>)}

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => logout()}>logout</button>
        <button onClick={() => setPage('reccomendations')}>reccomendations</button>
      </div>

      <Authors authors={authors} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Reccomendations show={page === 'reccomendations'}/> 
    </div>
  )
}

export default App
