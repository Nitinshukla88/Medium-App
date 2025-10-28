import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

// Run "npm run deploy to deploy the app to Cloudflare Workers"

const app = new Hono<{ // In Hono, we can define types for various things like env, bindings, etc.  
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }
}>()

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

export default app
 
// Things we haven't done - 

// 1. Adding pagination to the bulk fetch API of blogs
// 2. Input validation using Zod 
