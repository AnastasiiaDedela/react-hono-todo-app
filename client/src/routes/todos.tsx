import { createFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleX } from 'lucide-react'
import { useState } from 'react'
import type { AppType } from '../../../server/index'

const client = hc<AppType>('/')

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
})

function RouteComponent() {
  const [todo, setTodo] = useState('')
  const queryClient = useQueryClient()

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

  const createTodo = useMutation({
    mutationFn: async (title: string) => {
      const res = await client.api.todos.$post({
        json: { title },
      })

      if (!res.ok) {
        throw new Error('failed to create todo')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setTodo('')
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
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={todo}
          placeholder="Add a new todo"
          className="input input-neutral w-full max-w-xs"
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => createTodo.mutate(todo)}
        >
          Add
        </button>
      </div>

      <h2>Your Todos</h2>
      <div className="space-y-3 py-5">
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
        {data?.map((task) => (
          <div>
            <div className="flex flex-row items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <div>{task.title}</div>
            </div>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
