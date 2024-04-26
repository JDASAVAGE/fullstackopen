import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
const Books = (props) => {
const[genre,setGenre]=useState('')
const ALL_BOOKS=gql`
  query {
    allBooks {
      title
      published
      author{
        name
        born
      }
      genres
    }
  }
  `
  const { loading, error, data } = useQuery(ALL_BOOKS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>
  if (!props.show) {
    return null
  }
  let books = data.allBooks
  if (genre){
    books=books.filter(book=>book.genres.includes(genre))
  }
  console.log(books)
  return (
    <div>
      <h2>books</h2>
       <br/>
       <h4>In genre {genre}</h4>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setGenre('Love')}>Love</button>
        <button onClick={() => setGenre('Friendship')}>Friendship</button>
        <button onClick={() => setGenre('Technology')}>Technology</button>
        <button onClick={() => setGenre('')}>All</button>
      </div>
    </div>
  )
}

export default Books
