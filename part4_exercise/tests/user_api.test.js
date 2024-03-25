const { test, after, beforeEach, describe } = require('node:test')
const User=require('../models/user')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root',name:"Root",passwordHash})
  
      await user.save()
    })
    test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd= await User.find({})
    assert.strictEqual(usersAtEnd.length,usersAtStart.length+1)
    const usernames= usersAtEnd.map(u=>u.username)
    assert(usernames.includes(newUser.username))
    })
    
    test('creation fails due to repeated username',async()=>{
    const usersAtStart = await User.find({})
    const newUser = {
      username: 'root',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

      const result=await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      const usersAtEnd= await User.find({})
      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(usersAtEnd.length,usersAtStart.length)
    })
    
    test('creation fails due to short password',async()=>{
        const usersAtStart=await User.find({})
        const newUser={
            username:'SteveTheKid',
            name:"Steve",
            password:"1"
        }
        const result= await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type',/application\/json/)
    const usersAtEnd=await User.find({})
    assert(result.body.error.includes('Password must be at least 4 characters long'))
    assert.strictEqual(usersAtEnd.length,usersAtStart.length)
    })
})


after(async () => {
        await mongoose.connection.close()})
  