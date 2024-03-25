const Display= (props)=>(
    <div>{props.filteredPeople.map(person=><div key={person.id}>{person.name} {person.number} <button onClick={()=>props.deleteContact(person.id)}>delete</button></div>)}</div>
  )
 export default Display