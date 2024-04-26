import axios from "axios"
import { useParams } from "react-router-dom"
import { useState,useEffect } from "react"
import user from "../services/user"
const User=() => {
  const[u,setU]=useState([])
  const id=useParams().id
  useEffect(() => {
    const fetchData = async () => {
      const user= await axios.get(`/api/users/${id}`)
      setU(user.data)
    }
    fetchData()
  },[])
  if (u.length===0){
    return null
  }
  return(
    <>
      <h2>{u.username}</h2>
      <h3>added blogs</h3>
      <ul>
        {u.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </>
  )
}
export default User