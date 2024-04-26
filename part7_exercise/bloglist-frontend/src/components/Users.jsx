import userService from '../services/user'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
const Users=() => {
  const[data,setData]=useState([])
  useEffect(() => {
    const fetchData = async () => {
      const result = await userService.retrieve()
      setData(result)
    }
    fetchData()
  },[])
  return(
    <>
      <h2>Users</h2>
      <table className="borderless-table">
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user =>
            <tr key={user.id}>
              <Link to={`/users/${user.id}`}> <td>{user.username}</td> </Link>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )}

export default Users