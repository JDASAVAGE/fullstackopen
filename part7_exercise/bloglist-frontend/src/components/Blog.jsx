import { useState } from "react"
const Blog = ({ blog,handleLikes,handleDeletions }) => {
  const[buttonView,setButtonView]=useState("view")
  const[visible,setVisible]=useState("none")
  const[blogUsername,setName]=useState(blog.user.name)
  const deletionVisibility= () => {
    var test=window.localStorage.getItem('loggedBlogUser')
    if(blog.user.name===JSON.parse(test).name){
      return ""}
    else {
      return "none"
    }
  }
  const[deletionButton,setView]=useState(deletionVisibility())
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const changeView=() => {
    if(buttonView==="view")
    {setButtonView("hide")
      setVisible("")
    }
    else{
      setButtonView("view")
      setVisible("none")
    }
  }
  const updateBlog=() => {
    const updatedBlog=({
      ...blog,
      likes:blog.likes?blog.likes+1:1
    })
    handleLikes(updatedBlog)
  }
  const deleteBlog=(handleDeletions,id) => {
    handleDeletions(id)
  }
  return(
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author}
        <button className="togglingbutton" onClick={changeView}>{buttonView}</button>
        <div style={{ display:visible }}>
          <p>{blog.url}</p>
    likes {blog.likes}<button className="likebutton "onClick={updateBlog}>like</button><br></br>
          <p>{blogUsername}</p>
          <button style={{ display:deletionButton }} onClick={() => deleteBlog(handleDeletions,blog.id)}>remove</button>
        </div>

      </div>
    </div>
  )
}

export default Blog