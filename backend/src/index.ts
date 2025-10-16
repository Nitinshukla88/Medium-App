import { Hono } from 'hono'
import { PrismaClient } from '../src/generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const app = new Hono<{ // In Hono, we can define types for various things like env, bindings, etc.
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

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
  const user = await prisma.user.create({
    data : {
      email : body.email,
      password : body.password
    }
  })
  const token = await sign({ id : user.id }, c.env.JWT_SECRET)

  return c.json({ jwt : token })
})
// For sign in
app.post('/api/v1/signIn', async(c) => {

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
 