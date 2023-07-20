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

  const hello = await trpc.api.hello.query()
  console.log('>>> anon:hello:', hello)

  const postList = await trpc.posts.list.query()
  console.log('>>> anon:posts:list:', postList)

  await trpc.posts.reset.mutate()
}

void start()
