'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getListas, createLista, updateLista, deleteLista, ListaResponse } from '@/lib/api/listas'
import { getTodos, TodoResponse } from '@/lib/api/todos'
import ListCard from '@/components/ListCard'
import CreateListModal from '@/components/CreateListModal'
import DeleteModal from '@/components/DeleteModal'

function isToday(dateStr?: string | null) {
  if (!dateStr) return false
  const today = new Date().toISOString().slice(0, 10)
  return dateStr.slice(0, 10) === today
}

function isOverdue(dateStr?: string | null, completed?: boolean) {
  if (!dateStr || completed) return false
  return dateStr.slice(0, 10) < new Date().toISOString().slice(0, 10)
}

export default function DashboardPage() {
  const router = useRouter()
  const [listas, setListas] = useState<ListaResponse[]>([])
  const [todos, setTodos] = useState<TodoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [editingLista, setEditingLista] = useState<ListaResponse | null>(null)
  const [deletingLista, setDeletingLista] = useState<ListaResponse | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      setError('')
      const [l, t] = await Promise.all([getListas(), getTodos()])
      setListas(l)
      setTodos(t)
    } catch {
      setError('No se pudieron cargar las listas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const urgentTodos = todos.filter((t) => !t.completed && (isToday(t.dueDate) || isOverdue(t.dueDate, t.completed)))

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted">Cargando...</p></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text">Mis Listas</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-500 transition text-sm"
        >
          + Nueva lista
        </button>
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {urgentTodos.length > 0 && (
        <section className="mb-8">
          <h2 className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">Para hoy</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {urgentTodos.map((t) => {
              const lista = listas.find((l) => l.id === t.listaId)
              const overdue = isOverdue(t.dueDate, t.completed)
              return (
                <div
                  key={t.id}
                  onClick={() => t.listaId && router.push(`/listas/${t.listaId}`)}
                  className={`flex-shrink-0 bg-surface border rounded-xl p-4 w-52 cursor-pointer hover:border-primary/50 transition ${overdue ? 'border-danger/40' : 'border-border'}`}
                >
                  <p className="text-text text-sm font-medium truncate">{t.title}</p>
                  {lista && <p className="text-muted text-xs mt-1 truncate">{lista.name}</p>}
                  {overdue && <p className="text-danger text-xs mt-1">Vencida</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {listas.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-4xl mb-4">📂</p>
          <p className="text-text font-semibold">No hay listas</p>
          <p className="text-muted text-sm mt-1">Crea tu primera lista con el botón +</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listas.map((lista) => {
            const listTodos = todos.filter((t) => t.listaId === lista.id)
            const completed = listTodos.filter((t) => t.completed).length
            return (
              <ListCard
                key={lista.id}
                title={lista.name}
                color={lista.color}
                taskCount={listTodos.length}
                completedCount={completed}
                onClick={() => router.push(`/listas/${lista.id}`)}
                onEdit={() => setEditingLista(lista)}
                onDelete={() => setDeletingLista(lista)}
              />
            )
          })}
        </div>
      )}

      {showCreate && (
        <CreateListModal
          onSave={async (data) => { await createLista(data); await fetchAll() }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {editingLista && (
        <CreateListModal
          initial={{ name: editingLista.name, color: editingLista.color }}
          onSave={async (data) => { await updateLista(editingLista.id, data); await fetchAll() }}
          onClose={() => setEditingLista(null)}
        />
      )}

      {deletingLista && (
        <DeleteModal
          itemName={deletingLista.name}
          onConfirm={async () => { await deleteLista(deletingLista.id); await fetchAll(); setDeletingLista(null) }}
          onClose={() => setDeletingLista(null)}
        />
      )}
    </div>
  )
}
