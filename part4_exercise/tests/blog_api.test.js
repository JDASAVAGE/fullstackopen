const { test, after, beforeEach } = require('node:test')
const Blog=require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(blogs[0])
    await blogObject.save()
    blogObject = new Blog(blogs[1])
    await blogObject.save()
  })


test('all blogs are returned', async () => {
  const response= await api.get('/api/blogs')
  assert.strictEqual(response.body.length,blogs.length)
})

test('unique identifier is named id', async()=>{
  const blogs= await Blog.find({})
  blogs.forEach(blog => {assert.ok(blog.id)})
})

test('post request works',async()=>{
    const newBlog={_id: "5a422a851b54a676234d17f9",
    title: "Why Nations fail",
    author: "Jerome Goh",
    url: "https://Jerome.com/",
    likes: 12,
    __v: 0}
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    const blogsAtEnd= await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length,blogs.length+1)

})

test('update likes works',async()=>{
    blogToUpdate=blogs[0]
    const blog={likes:10}
    const updatedBlog=await api.patch(`/api/blogs/${blogToUpdate._id}`)
    .send(blog)
    .expect(200)
    assert.strictEqual(updatedBlog.body.likes,10)
})

test('delete request works',async()=>{
    blogToDelete=blogs[0]
    await api.delete(`/api/blogs/${blogToDelete._id}`)
    .expect(204)
    const blogsAtEnd= await api.get('/api/blogs')
    const contents=blogsAtEnd.body.map(r=>r.title)
    assert(!contents.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.body.length,blogs.length-1)
})

test('like propery default to 0 when missing',async()=>{
  const newBlog={_id: "5a422a851b54a676234d17f9",
    title: "Why Nations fail",
    author: "Jerome Goh",
    url: "https://Jerome.com/",
    __v: 0}
    const sentBlog=await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    assert.strictEqual(sentBlog.body.likes,0)
})

test('status code 400 Bad Requesr when title or url properties missing',async()=>{
const newBlog={_id: "5a422a851b54a676234d17f9",
    author: "Jerome Goh",
    url: "https://Jerome.com/",
    __v: 0}
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    const blogsAtEnd= await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length,blogs.length)
})
after(async () => {
  await mongoose.connection.close()
})