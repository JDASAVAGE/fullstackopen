import { gql,useQuery } from "@apollo/client"
const Reccomendations=(props)=>{
    const user_details=gql`
    query {
      me {
        username
        favoriteGenre
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
        born
      }
      genres
    }
  }
  `
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const user=useQuery(user_details)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>
  if (!props.show) {
    return null
  }
  let books = data.allBooks.filter(book=>book.genres.includes(user.data.me.favoriteGenre))
    return(
    <div>
        <h2>reccomendations</h2>
        <br/>
        <h4>books in your favourite genre {user.data.me.favoriteGenre}</h4>
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
    </div>
    )
}

export default Reccomendations