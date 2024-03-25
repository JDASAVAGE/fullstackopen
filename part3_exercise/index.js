require('dotenv').config()
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const Contact = require('./models/contact')

app.use((request, response, next) => {
  const timestamp = new Date().toUTCString()
  request.timestamp = timestamp
  next()
})
morgan.token('content', (request)=> { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
  
  
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/info',(request,response)=> {
  Contact.find({}).then(persons => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${request.timestamp}`)
  })})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
  
app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  Contact.findOne({ name: body.name })
    .then(existingContact => {
      if (existingContact) {
        console.log('activated')
        // Update the existing contact
        Contact.findByIdAndUpdate(existingContact._id, body, { new: true })
          .then(updatedContact => {
            response.json(updatedContact)
          })
          .catch(error => next(error))
      } else {
        // Create a new contact
        const person = new Contact({
          name: body.name,
          number: body.number
        })
        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
  