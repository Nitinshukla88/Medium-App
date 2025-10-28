import z from "zod";

export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

// type inference in zod

export const signInInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createBlogInput = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20),
  tags: z.array(z.string()).optional(),
});

export const updateBlogInput = z.object({
  blogId: z.string().uuid(),
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(20).optional(),
  tags: z.array(z.string()).optional(),
});

export type SignUpInput = z.infer<typeof signUpInput>;
export type SignInInput = z.infer<typeof signInInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;


// Since we have not initialised this project as monorepo, we should publish this code as module to npm to use it in other services for example here in backend or frontend service.

// If this would have been a monorepo we could have simply imported it using relative paths in our frontend and backend services.

// To publish this code we make a npmignore file to ignore files which are not necessary for production like tsconfig.json, src folder - because src would not be needed as we would be publishing the compiled js files in dist folder.