import { createFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useQuery } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
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
    <div className="flex flex-col items-center p-10 gap-10">
      {isError && (
        <div role="alert" className="alert alert-error">
          <CircleX />
          <span>Error: {error.message}</span>
        </div>
      )}
      <div className="space-y-3">
        {isLoading && (
          <>
            {[1, 2, 3, 4, 5].map(() => (
              <div className="flex flex-row items-center gap-3">
                <div className="skeleton h-7 w-7 rounded-full"></div>
                <div className="skeleton h-6 w-32"></div>
              </div>
            ))}
          </>
        )}
        {data?.map((todo) => (
          <div className="flex flex-row items-center gap-3">
            <input type="checkbox" className="checkbox checkbox-primary" />
            <div>{todo.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
