import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono()

// Here c in the callback function is the context object
// It contains request and response objects among other things
app.get('/', (c) => {

  // This Prisma Client is not declared globally because sometimes in serverless environments we lose the global state so try to avoid declaring variable globally
  const prisma = new PrismaClient({
    datasourceUrl : env.DATABASE_URL,
  }).$extends(withAccelerate())
  return c.text('Hello Hono!')
})

// Ideally we should have a separate route file for each resource but it's fine for now

// For sign up
app.post('/api/v1/signUp', async(c) => {

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
 