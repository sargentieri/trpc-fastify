import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { serverConfig } from '../config'
import type { AppRouter } from '../server/router'

async function start() {
  const { port, prefix } = serverConfig
  const urlEnd = `localhost:${port}${prefix}`

  const trpc = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `http://${urlEnd}`,
        async headers() {
          return {
            username: 'nyan',
          }
        },
      }),
    ],
  })

  const version = await trpc.api.version.query()
  console.log('>>> version:', version)

  await trpc.posts.create.mutate({ title: 'Title Alpha' })
  await trpc.posts.create.mutate({ title: 'Title Bravo' })
  await trpc.posts.create.mutate({ title: 'Title Charlie' })
  console.log('>>> anon:creating...:')

  const postList = await trpc.posts.list.query()
  console.log('>>> posts:list:', postList)

  const postListWithArgs = await trpc.posts.list.query({
    includes: ['id', 'title'],
  })
  console.log('>>> posts:list:args:', postListWithArgs)

  await trpc.posts.reset.mutate()
}

void start()
