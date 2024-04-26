const Book = require('./models/book')
const Author = require('./models/author')
const User=require('./models/user')
const jwt = require('jsonwebtoken')
const { ApolloServer } = require('@apollo/server')
const mongoose = require('mongoose')
const {GraphQLError}= require('graphql')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
mongoose.set('strictQuery', false)


require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

  const typeDefs = `
type Author{
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
}
type Book{
    title:String!
    published:Int!
    author:Author!
    id:ID!
    genres:[String!]!
}  
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}
type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre:String ):[Book!]!
    allAuthors:[Author!]!
    me:User
  }
type Mutation {
    addBook(
        title:String!
        published:Int!
        author:String!
        genres:[String!]!
    ): Book
    editAuthor(
        name:String!
        setBornTo: Int!
    ):Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
  type Subscription{
    bookAdded: Book!
  }
`
const addAuthor=async(author)=>{
    const NA= new Author({name:author})
    const savedAuthor= await NA.save()
    return savedAuthor
}
const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount:()=>Author.collection.countDocuments(),
    allBooks:async(root,args)=> {
        var books=await Book.find({})
        if (args.author){
            afiltered=books.filter(p => p.author === args.author)
                if(args.genre){
                    return afiltered.filter(p => p.genres.includes(args.genre))}
            return afiltered     
        }
        if(args.genre){
            return books.filter(p => p.genres.includes(args.genre))
        }
        return books},
    allAuthors:async () => await Author.find({}),
    me:(root, args, context) => {
      return context.currentUser},
  },
  Author: {    
    bookCount: async(root) => {
        var books=await Book.find({}).populate('author')
        const foundBooks = books.filter(book => book.author === root.name);
        return foundBooks.length
    }
  },
  Book:{  
    author: async (root) => {
    return await Author.findById(root.author)}},
  Mutation: {
    addBook: async(root, args,context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      } 
    var books=await Book.find({}).populate('author')
    if (books.filter(p => p.author.name === args.author).length === 0){
       new_author=await addAuthor(args.author)
       const book = new Book({ ...args, author: new_author })
       try{await book.save()}
       catch(error){throw new GraphQLError('Adding Book failed', {
        extensions: {
          code: 'TITLE_LENGTH_SHORT',
          invalidArgs: args.title,
          error
        }
      })}
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
     }
        const authors=await Author.find({})
        const author=authors.find(author=>author.name===args.author)
        const book = new Book({ ...args,author:author})
        try{await book.save()}
        catch(error){throw new GraphQLError('Adding Book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })}
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
       },
       editAuthor: async(root, args,context) => {
        const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      } 
        const authors=await Author.find({})
        console.log(authors)
        console.log(args.name)
        const author = authors.find(p => p.name === args.name)
        if (!author) {
          return null
        }
        const updatedPerson = { born: args.setBornTo } // Only update the fields you want to change
        const au = await Author.findByIdAndUpdate(author.id, updatedPerson, { new: true })
        return au},
        createUser: async (root, args) => {
          const user = new User({ username: args.username,favoriteGenre: args.favoriteGenre })
          return user.save()},
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
        
            if ( !user || args.password !== 'secret' ) {
              throw new GraphQLError('wrong credentials', {
                extensions: {
                  code: 'BAD_USER_INPUT'
                }
              })        
            }
        
            const userForToken = {
              username: user.username,
              id: user._id,
            }
        
            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
          }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

 const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), process.env.JWT_SECRET
        )
        const currentUser = await User
          .findById(decodedToken.id)
        return { currentUser }
      }
    }
    }),
  )

  const PORT = 4001

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()