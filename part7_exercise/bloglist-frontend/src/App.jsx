import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Blogindiv from './components/Blogindiv'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import Blogform from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationreducer'
import { initializeblogs,appendBlog,likeBlog,deleteBlog } from './reducers/blogreducer'
import { setUser } from './reducers/userreducer'
import { BrowserRouter as Router,Routes, Route, Link,useParams,useNavigate } from 'react-router-dom'
const BlogWithId=(handleLikes, handleDeletions) => {
  const blogs = useSelector(state => state.blogs) // assuming you have access to Redux state
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)

  return <Blogindiv blog={blog} handleLikes={handleLikes} handleDeletions={handleDeletions} />
}
const App = () => {
  const[username, setUsername]= useState("")
  const [password, setPassword]=useState("")
  const[colour,setColour]=useState("red")
  const dispatch = useDispatch()
  const notificationState=useSelector(state => state.notification)
  const blogState = useSelector(state => state.blog)
  const blogs=useSelector(state => state.blogs)
  const user=useSelector(state => state.user)
  useEffect(() => {
    dispatch(initializeblogs())
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setColour("Red")
      dispatch(setNotification('Wrong credentials'))
      setTimeout(() => {
        dispatch(setNotification(null))
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
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedBlogUser')
  }
  const handleCreation=async (BlogToAdd) => {
    try {
      dispatch(appendBlog(BlogToAdd))
      setColour("Green")
      dispatch(setNotification(`a new blog ${BlogToAdd['title']} by ${BlogToAdd['author']} has been added`))
      setTimeout(() => {
        dispatch(setNotification(null))
      }, 2000)
    }

    catch (exception) {
      setColour("Red")
      dispatch(setNotification('Invalid input'))
      setTimeout(() => {
        dispatch(setNotification(null))
      }, 5000)}
  }
  const handleLikes= async(BlogtoUpdate) => {
    dispatch(likeBlog(BlogtoUpdate))
  }
  const handleDeletions=async(id) => {
    const existingBlog =blogs.find(blog => blog.id === id)
    if(window.confirm(`Delete ${existingBlog.title} ?`)===true){
      dispatch(deleteBlog(id))
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
  const padding = {
    paddingRight: 5
  }
  const Mainpage=() => {
    return(<div>
      <h2>blogs</h2>
      {notificationState === null ?
        null :
        <div className="notification" style={headerStyle}>
          {notificationState}
        </div>
      }
      {user === null ?
        loginForm() :
        <div><p>{user.name} logged in </p><button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new note">
            <Blogform handleCreation={handleCreation}/>
          </Togglable>
          {[...blogs].sort(function(a,b){return b.likes-a.likes}).map(blog => <Link  key={blog.id} to={`/blogs/${blog.id}`}><Blog blog={blog} handleLikes={handleLikes} handleDeletions={handleDeletions}/></Link>)}
        </div>
      }
    </div>)
  }
  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">blogs</Link>
          <Link style={padding} to="/users">users</Link>
        </div>
        <Routes>
          <Route path="/users/:id" element={<User/>} />
          <Route path="/" element={<Mainpage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/blogs/:id" element={<BlogWithId handleLikes={handleLikes} handleDeletions={handleDeletions} />} />
        </Routes>
      </Router>
    </div>
  )}

export default App