import { Hono } from "hono";
import { PrismaClient } from '../generated/prisma/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'   

type Bindings = {
    DATABASE_URL: string;
    JWT_SECRET: string;
}

export const blogRouter = new Hono<{ Bindings: Bindings }>();

// Here * means all the routes that start with /api/v1/blog/ - put this check (here we have put auth check) before all these routes which stats form /api/v1/blog/ 

// Put all the routes inside try and catch block to handle errors globally 
blogRouter.use('/*', async (c, next) => {
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

// For create blog
blogRouter.post('/', async(c) => {
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()

  const blog = await prisma.post.create({
    data : {
        title : body.title,
        content : body.content,
        authorId : c.get('userId') as string // Getting userId from context
    }
  })
  return c.json({ id : blog.id, message : 'Blog created successfully' })
})
// For update blog
blogRouter.put('/', async(c) => {
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()

  const blog = await prisma.post.update({
    where: {
      id: body.id
    },
    data : {
        title : body.title,
        content : body.content,
    }
  })
  return c.json({ id : blog.id, message : 'Blog updated successfully' })

})
// For get blog
blogRouter.get('/', async(c) => {
    const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json()

  const blog = await prisma.post.findFirst({
    where: {
      id: body.id
    }
  })
  return c.json({ id : blog.id })
})

blogRouter.get('/bulk', async(c) => {

})