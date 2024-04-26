const Blogindiv=({ blog,handleLikes,handleDeletions }) => {
  const updateBlog=() => {
    const updatedBlog=({
      ...blog,
      likes:blog.likes?blog.likes+1:1
    })
    handleLikes(updatedBlog)
  }
  const deleteBlog=(handleDeletions,id) => {
    handleDeletions(id)}
  return(
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.url} {blog.author}</p>
    likes {blog.likes}<button className="likebutton "onClick={updateBlog}>like</button><br></br>
      <p>added by {blog.user.name}</p>
      <button onClick={() => deleteBlog(handleDeletions,blog.id)}>remove</button>
    </div>
  )
}

export default Blogindiv