import { gql,useMutation } from "@apollo/client"
import { useState } from "react"
import Select from 'react-select';



const Authors = (props) => {
  const ALL_PERSONS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
  `
  const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) 
  {editAuthor(name: $name, setBornTo: $setBornTo) 
    {      
    name
    born
    id
    bookCount
    }
  }
`
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange,
    setValue
  }
}
const born=useField('born')
const [selectedOption, setSelectedOption] = useState(null)
const[update_server]=useMutation(EDIT_AUTHOR,{refetchQueries: [ {query:ALL_PERSONS} ]})
  if (!props.show) {
    return null
  }
  console.log(props.authors)
  if (props.authors.loading) {
    return <div>loading...</div>
  }
  const update=(e)=>{
     e.preventDefault()
    update_server({  variables: { name:selectedOption.value,setBornTo:Number(born.value) } })
    setSelectedOption(null)
    born.setValue('')

  }
  const options = props.authors.data.allAuthors.map(author => ({
    value: author.name,
    label: author.name
  }))
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {props.authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={update}>
        <div>
          name
          <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
      />
        </div>
        <div>
          born
        <input value={born.value} onChange={born.onChange}></input>
        </div>
        <div>
        <button type="submit">update author</button>
        </div>
      </form>
    </div>
  )
}

export default Authors
