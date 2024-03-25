const User=require('../models/user')
const blogsRouter = require('express').Router()
const Blog=require('../models/blog')
const jwt = require('jsonwebtoken')
const blog = require('../models/blog')
blogsRouter.get('/', async(request, response) => {
    blogs=await Blog.find({}).populate("user")
    response.json(blogs)
      }
   )
const getTokenFrom = request => {
      const authorization = request.get('authorization')
      if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
      }
      return null
    }
  blogsRouter.post('/', async(request, response) => {
    const body=request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog= new Blog({
      title:body.title,
      author:body.author,
      url:body.url,
      likes:body.likes,
      user:user.id
    })
    const savedBlog= await blog.save()
    user.blogs=user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  })

blogsRouter.delete('/:id',async(request, response)=>{ 
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
  await Blog.findByIdAndDelete(request.params.id)
  user.blogs=user.blogs.filter(blog=>blog.toString()!==request.params.id)
   response.status(204).end()
})

blogsRouter.put('/:id',async(request,response)=>{
  const body=request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog= {
      title:body.title,
      author:body.author,
      url:body.url,
      likes:body.likes,
      user:user.id
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(updatedBlog)
})

blogsRouter.patch('/:id',async(request,response)=>{
   const firstUser= await User.findOne({})
   const blog={user:firstUser._id}
   const updatedBlog=await Blog.findByIdAndUpdate(request.params.id,blog,{new:true})
   firstUser.blogs=firstUser.blogs.concat(updatedBlog._id)
   await firstUser.save()
   response.status(200).json(updatedBlog)
})
module.exports = blogsRouter