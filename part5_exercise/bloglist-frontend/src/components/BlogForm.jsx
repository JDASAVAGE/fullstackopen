import { useState } from "react"
import PropTypes from "prop-types"
const Blogform=({ handleCreation }) => {
  const[title,setTitle]=useState("")
  const[author,setAuthor]=useState("")
  const[url,setUrl]=useState("")
  const addBlog=(event) => {
    event.preventDefault()
    handleCreation({ title:title,author:author,url:url })
    setTitle("")
    setAuthor("")
    setUrl("")
  }
  return(
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder="write title here"
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="write author here"
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder="write url here"
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}
Blogform.propTypes={
  handleCreation: PropTypes.func.isRequired
}
export default Blogform

