import { apiRouter } from './routers/api'
import { postsRouter } from './routers/posts'
import { userRouter } from './routers/users'
import { router } from './trpc'

export const appRouter = router({
  posts: postsRouter,
  api: apiRouter,
  users: userRouter,
})

export type AppRouter = typeof appRouter
