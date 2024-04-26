import{ createSlice } from "@reduxjs/toolkit"
import blogService from '../services/blogs'
const blogSlice=createSlice({
  name:"blogs",
  initialState:[],
  reducers:{ createBlog(state,action){
    const content=action.payload
    state.push( content)
  }, setBlogs(state, action) {
    return action.payload
  },handleLike(state,action){
    const updatedBlog=action.payload
    return state.map(blog =>
      blog.id !== updatedBlog.id ? blog : updatedBlog
    )}, handleDeletion(state,action){
    const id=action.payload
    return state.filter(x => x.id!==id)
  }   },
})
export const initializeblogs=() => {
  return async dispatch => {
    const blogs=await blogService.getAll()
    dispatch(setBlogs(blogs.sort(function(a,b){return b.likes-a.likes})))
  }
}
export const appendBlog=(blog) => {
  return async dispatch => {
    const newBlog= await blogService.create(blog)
    dispatch(createBlog(newBlog))
  }
}
export const likeBlog=(update) => {
  return async dispatch => {
    const updatedBlog=await blogService.update(update)
    dispatch(handleLike(updatedBlog))
  }
}
export const deleteBlog=(id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(handleDeletion(id))

  }
}
export const { createBlog,setBlogs,handleLike,handleDeletion }=blogSlice.actions
export default blogSlice.reducer