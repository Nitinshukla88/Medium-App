import { Hono } from 'hono'

const app = new Hono()

// Here c in the callback function is the context object
// It contains request and response objects among other things
app.get('/', (c) => {
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
 