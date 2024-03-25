const Filter=(props)=>{
    return(
      <>
      <input value={props.newFilter} onChange={props.change}/>
      </>
    )
  }
  export default Filter