import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

/**
 * Schema objects -> used for validation and deriving types as seen
 * ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
 */
export const zPost = z.object({
  id: z.number(),
  title: z.string(),
})

export const zDb = z.object({
  posts: z.array(zPost),
})

type IPost = z.infer<typeof zPost>

type IDb = z.infer<typeof zDb>

const db: IDb = {
  posts: [],
}

/**
 * ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====
 */

/**
 * Schema objects -> used for validation and deriving types as seen
 * ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
 */
const zCreateInput = z.object({ title: z.string() })

const zIncludes = zPost.keyof().array()

const zPostsInput = z
  .object({
    includes: zIncludes,
  })
  .optional()

type IPostsList = z.infer<typeof zPostsInput>

export const postsRouter = router({
  create: publicProcedure
    .input(zCreateInput)
    .mutation(async ({ input, ctx }): Promise<IPost> => {
      if (ctx.user.name !== 'nyan') {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      const id = db.posts.length + 1
      const post = { id, ...input }
      await db.posts.push(post)
      return post
    }),
  list: publicProcedure.input(zPostsInput).query(({ input }) => {
    const includedFields = input?.includes

    // values to include in query
    const includeValues = <T>(arr: Array<T>, keys: Array<keyof T>) => {
      return arr.map((x: T) =>
        Object.fromEntries(
          Object.entries(x as Array<T>).filter(([k]) =>
            keys.includes(k as keyof T)
          )
        )
      )
    }

    return includedFields
      ? includeValues<IPost>(db.posts, includedFields)
      : db.posts
  }),

  reset: publicProcedure.mutation(() => {
    db.posts = []
  }),
})
