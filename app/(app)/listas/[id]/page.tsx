'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getListas, ListaResponse } from '@/lib/api/listas'
import { getTodosByLista, createTodo, updateTodo, deleteTodo, TodoResponse, Priority } from '@/lib/api/todos'
import TaskRow from '@/components/TaskRow'
import TaskModal from '@/components/TaskModal'
import DeleteModal from '@/components/DeleteModal'

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [lista, setLista] = useState<ListaResponse | null>(null)
  const [todos, setTodos] = useState<TodoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoResponse | null>(null)
  const [deletingTodo, setDeletingTodo] = useState<TodoResponse | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      setError('')
      const [listas, todosData] = await Promise.all([getListas(), getTodosByLista(id)])
      setLista(listas.find((l) => l.id === id) ?? null)
      setTodos(todosData)
    } catch {
      setError('No se pudieron cargar las tareas')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchAll() }, [fetchAll])

  const completedCount = todos.filter((t) => t.completed).length

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted">Cargando...</p></div>
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-text transition">Inicio</Link>
        <span>/</span>
        <span className="text-text font-medium">{lista?.name ?? 'Lista'}</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">{lista?.name ?? 'Lista'}</h1>
          <p className="text-muted text-sm mt-1">{completedCount}/{todos.length} completadas</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-500 transition text-sm"
        >
          + Nueva tarea
        </button>
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-text font-semibold">Sin tareas</p>
          <p className="text-muted text-sm mt-1">Agrega tu primera tarea con el botón +</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TaskRow
              key={todo.id}
              todo={todo}
              onToggle={async () => {
                await updateTodo(todo.id, { completed: !todo.completed })
                setTodos((prev) => prev.map((t) => t.id === todo.id ? { ...t, completed: !t.completed } : t))
              }}
              onEdit={() => setEditingTodo(todo)}
              onDelete={() => setDeletingTodo(todo)}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <TaskModal
          onSave={async (data) => {
            await createTodo({ ...data, listaId: id })
            await fetchAll()
          }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {editingTodo && (
        <TaskModal
          initial={editingTodo}
          onSave={async (data) => {
            await updateTodo(editingTodo.id, data)
            await fetchAll()
          }}
          onClose={() => setEditingTodo(null)}
        />
      )}

      {deletingTodo && (
        <DeleteModal
          itemName={deletingTodo.title}
          onConfirm={async () => {
            await deleteTodo(deletingTodo.id)
            await fetchAll()
            setDeletingTodo(null)
          }}
          onClose={() => setDeletingTodo(null)}
        />
      )}
    </div>
  )
}
