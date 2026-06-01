import api from './client'

export type ListaResponse = {
  id: string
  name: string
  color: string
  userId: string
  createdAt: string
}

export const getListas = (): Promise<ListaResponse[]> =>
  api.get<ListaResponse[]>('/listas').then((r) => r.data)

export const createLista = (data: { name: string; color: string }): Promise<ListaResponse> =>
  api.post<ListaResponse>('/listas', data).then((r) => r.data)

export const updateLista = (id: string, data: { name?: string; color?: string }): Promise<ListaResponse> =>
  api.put<ListaResponse>(`/listas/${id}`, data).then((r) => r.data)

export const deleteLista = (id: string): Promise<void> =>
  api.delete(`/listas/${id}`).then(() => undefined)
