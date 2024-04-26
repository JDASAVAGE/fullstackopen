import { useState } from "react"
const Login=(props)=>{
    const[username,setUsername]=useState('')
    const[password,setPassword]=useState('')
const submitForm=(e)=>{
  e.preventDefault()
  props.login({  variables: { username,password } })  
}
if (!props.show) {
    return null
  }
    return(
        <div>
            <form onSubmit={submitForm}>
                <div>
                 Username<input value={username} onChange={({ target }) => setUsername(target.value)} />
                </div>
                <div>
                 Pasword<input value={password} onChange={({ target }) => setPassword(target.value)}/>
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default Login