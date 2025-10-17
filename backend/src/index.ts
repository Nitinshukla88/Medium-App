import { Hono } from 'hono'
import { PrismaClient } from '../src/generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

const app = new Hono<{ // In Hono, we can define types for various things like env, bindings, etc.
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }
}>()

// Here * means all the routes that start with /api/v1/blog/ - put this check (here we have put auth check) before all these routes which stats form /api/v1/blog/ 
app.use('/api/v1/blog/*', async (c, next) => {
  // Middleware to check for JWT token in Authorization header
  const authHeader = c.req.header('Authorization') || ""
  const token = authHeader.split(' ')[1] // Assuming Bearer token -> This code will split the authHeader into ['Bearer', 'token'] and take the token part
  if(!token) {
    c.status(401)
    return c.json({ error : 'Unauthorized' })
  }
  const payload = await verify(token, c.env.JWT_SECRET)
  if(!payload) {
    c.status(401)
    return c.json({ error : 'Unauthorized' })
  } 
  c.set('userId', payload.id as string) // Setting userId in context so that we can use it in the route handlers
  await next()
})

// Here c in the callback function is the context object
// It contains request and response objects among other things
// app.get('/', (c) => {

//   // This Prisma Client is not declared globally because sometimes in serverless environments we lose the global state so try to avoid declaring variable globally. Also, In Serverless environments, we can't access the env variables outside the handler function as each handler is independently deployed.

//   const prisma = new PrismaClient({
//     datasourceUrl : c.env.DATABASE_URL,
//   }).$extends(withAccelerate())
//   return c.text('Hello Hono!')
// })

// Ideally we should have a separate route file for each resource but it's fine for now

// For sign up
app.post('/api/v1/signUp', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  try {
    const user = await prisma.user.create({
    data : {
      email : body.email,
      password : body.password
    }
  })
  const token = await sign({ id : user.id }, c.env.JWT_SECRET)

  return c.json({ jwt : token })
  } catch (error) {
    c.status(500)
    return c.json({ error : 'Internal Server Error' })
  }
  
})
// For sign in
app.post('/api/v1/signIn', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()
  const user = await prisma.user.findUnique({
    where : {
      email : body.email,
      password : body.password
    }
  })
  if(!user) {
    c.status(403)
    return c.json({ error : "user not found" })
  }

  const jwt = await sign({ id : user.id }, c.env.JWT_SECRET)
  return c.json({ jwt })
})
// For create blog
app.post('/api/v1/blog', async(c) => {
  
})
// For update blog
app.put('/api/v1/blog', async(c) => {

})
// For get blog
app.get('/api/v1/blog/:id', async(c) => {

})

export default app
 