import { createFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useQuery } from '@tanstack/react-query'
import type { AppType } from '../../../server/index'

const client = hc<AppType>('/')

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.api.todos.$get()
      if (!res.ok) {
        throw new Error('failed to fetch todos')
      }
      return res.json()
    },
  })

  return (
    <div>
      {data?.map((todo) => {
        return <div>{todo.title}</div>
      })}
    </div>
  )
}
