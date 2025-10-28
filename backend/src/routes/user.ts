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

// For type checking one good method is we can install zod and define the schema for the request body and validate it before processing further. 

// Suppose a schema like this:-

// const signUpSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6)
// });

// Now to get the type of the schema we can use - z.infer<typeof signUpSchema>
// For export type we can use - export type SignUpType = z.infer<typeof signUpSchema> -------> This is called type inference.

// Now using this type any frontend developer can know what fields are required for sign up and what are their types without looking in the backend code. This will help in better type safety and less errors.

// But how this type will be shared with frontend ? Because this type is defined in backend only. 
// 1. One way is to create a separate package for types only and share it between frontend and backend which we will do in our project. That's the best use of monorepo structure.

// 2. Another way is to use tRPC which automatically shares types between frontend and backend.

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