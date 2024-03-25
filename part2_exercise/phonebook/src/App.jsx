import { useState,useEffect } from 'react'
import contactService from './services/contacts'
import Form from './components/Form'
import Filter from './components/Filter'
import Display from './components/Display'
import Notification from './components/Notification'
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const[newNumber,setNewNumber]= useState('')
  const[newFilter, setNewFilter]= useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const[colour,setColour]= useState('green')
  useEffect(() => {
    console.log('effect')
    contactService
      .getAll()
      .then(returnedContacts => {
        console.log('promise fulfilled')
        setPersons(returnedContacts)
      })
  }, [])
  console.log('render', persons.length, 'contacts')
  const addPerson = (event)=>{
    event.preventDefault()
    if(persons.some(person=>person.name==newName))
    {handleNumberUpdate(newName)} 
    else{
    const personObject = {name:newName, number:newNumber}
    contactService
    .create(personObject)
    .then(returnedContact=>{
    setPersons(persons.concat(returnedContact))
    setNewName('')
    setNewNumber('')
    setColour('green')
    setSuccessMessage(
      `${returnedContact.name}'s contact has been added.`
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    }) }
  }
  const handleNameChange = (event) => {
    console.log(event.target.value)
    var x= event.target.value
    setNewName(x)
  }
  const handleNumberUpdate=(value)=>{
    if (window.confirm(`${value} is already added to phonebook, replace the old number with a new one?`)){
      const changedContact = { name:value, number: newNumber }
      const existingPerson = persons.find(person => person.name === value)
      var id= existingPerson.id
      console.log(id)
contactService
.update(id,changedContact)
.then(returnedContact=>{
  setPersons(persons.map(person=>person.id!==id? person:returnedContact))
  setNewName('')
  setNewNumber('')
  setColour('green')
  setSuccessMessage(
    `${returnedContact.name}'s number has been updated.`
  )
  setTimeout(() => {
    setSuccessMessage(null)
  }, 5000)
}) 
.catch(error => {
  setColour('red')
  setSuccessMessage(
    `Information of '${existingPerson.name}' has already been removed from the server.`
  )
  setTimeout(() => {
    setSuccessMessage(null)
  }, 5000)
   }
)
  }
}
  const handleNumberChange=(event) =>{
    console.log(event.target.value)
    var x= event.target.value
    setNewNumber(x)
  }
  const handleFilterChange=(event) =>{
    console.log(event.target.value)
    var x= event.target.value
    setNewFilter(x)
  }
  const filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  const deleteContact=(id)=>{
    console.log(id)
    const existingPerson = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${existingPerson.name} ?`)==true){
    contactService
    .remove(id)
    .then(()=>setPersons(persons.filter(x=>x.id!==id)))
  }
}
  return (
    <div>
      <h2>Phonebook</h2>  
      <Notification message={successMessage} colour={colour}/>
        <div>
          filter shown with <Filter newFilter={newFilter} change={handleFilterChange}/>
        </div>
      <h2>add a new</h2>
      <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Display filteredPeople={filteredPeople} deleteContact={deleteContact}/>
    </div>
  )
}

export default App