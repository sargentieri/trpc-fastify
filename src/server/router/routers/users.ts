import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import type { Prisma } from '@prisma/client'

export const userRouter = router({
  list: publicProcedure.query(({ input, ctx }) => {
    return {
      text: `hello world`,
    }
  }),
})
