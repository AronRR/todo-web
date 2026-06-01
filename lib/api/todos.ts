import api from './client'

export type Priority = 'high' | 'medium' | 'low'

export type TodoResponse = {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  listaId: string | null
  dueDate?: string | null
  createdAt: string
  userId: string
}

export const getTodos = (): Promise<TodoResponse[]> =>
  api.get<TodoResponse[]>('/todos').then((r) => r.data)

export const getTodosByLista = (listaId: string): Promise<TodoResponse[]> =>
  api.get<TodoResponse[]>(`/listas/${listaId}/todos`).then((r) => r.data)

export const createTodo = (data: {
  title: string
  description: string
  priority: Priority
  listaId: string
  dueDate?: string
}): Promise<TodoResponse> =>
  api.post<TodoResponse>('/todos', data).then((r) => r.data)

export const updateTodo = (
  id: string,
  data: Partial<Pick<TodoResponse, 'title' | 'description' | 'completed' | 'priority' | 'dueDate'>>
): Promise<TodoResponse> =>
  api.put<TodoResponse>(`/todos/${id}`, data).then((r) => r.data)

export const deleteTodo = (id: string): Promise<void> =>
  api.delete(`/todos/${id}`).then(() => undefined)
