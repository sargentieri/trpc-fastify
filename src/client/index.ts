import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { serverConfig } from '../config'
import type { AppRouter } from '../server/router'

async function start() {
  const { port, prefix } = serverConfig
  const urlEnd = `localhost:${port}${prefix}`

  const trpc = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [httpBatchLink({ url: `http://${urlEnd}` })],
  })

  const version = await trpc.api.version.query()
  console.log('>>> anon:version:', version)

  const users = await trpc.users.list.query()
  console.log('>>> users:', users)

  const postList = await trpc.posts.list.query()
  console.log('>>> posts:list:', postList)

  await trpc.posts.reset.mutate()
}

void start()
