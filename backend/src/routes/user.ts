import { Hono } from "hono";
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export const userRouter = new Hono<{ Bindings: Bindings }>();

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
userRouter.post('/signUp', async(c) => {
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
userRouter.post('/api/v1/signIn', async(c) => {
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