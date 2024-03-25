import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import Blogform from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const[username, setUsername]= useState("")
  const [password, setPassword]=useState("")
  const[user,setUser]=useState(null)
  const[errormsg,setErrorMessage]=useState(null)
  const[colour,setColour]=useState("red")
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(function(a,b){return b.likes-a.likes}))
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setColour("Red")
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm=() => {
    return(
      <form onSubmit={handleLogin}>
        <div>
        username
          <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    )}
  const handleLogout=() => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogUser')
  }
  const handleCreation=async (BlogToAdd) => {
    try {
      const blog= await blogService.create(BlogToAdd)
      setBlogs([...blogs,blog])
      setColour("Green")
      setErrorMessage(`a new blog ${blog['title']} by ${blog['author']} has been added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }

    catch (exception) {
      setColour("Red")
      setErrorMessage('Invalid input')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)}
  }
  const handleLikes= async(BlogtoUpdate) => {
    const updatedBlog= await blogService.update(BlogtoUpdate)
    setBlogs(blogs.map(blog => blog.id!==BlogtoUpdate.id?blog:updatedBlog))
  }
  const handleDeletions=async(id) => {
    const existingBlog =blogs.find(blog => blog.id === id)
    if(window.confirm(`Delete ${existingBlog.title} ?`)===true){
      blogService
        .remove(id)
        .then(() => setBlogs(blogs.filter(x => x.id!==id)))
    }
  }
  const headerStyle={
    color: colour,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div>
      <h2>blogs</h2>
      {errormsg === null ?
        null :
        <div className="notification" style={headerStyle}>
          {errormsg}
        </div>
      }
      {user === null ?
        loginForm() :
        <div><p>{user.name} logged in </p><button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new note">
            <Blogform handleCreation={handleCreation}/>
          </Togglable>
          {blogs.sort(function(a,b){return b.likes-a.likes}).map(blog => <Blog key={blog.id} blog={blog} handleLikes={handleLikes} handleDeletions={handleDeletions}/>)}
        </div>
      }
    </div>
  )}

export default App