'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getListas, ListaResponse } from '@/lib/api/listas'
import { getTodos, TodoResponse } from '@/lib/api/todos'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [listas, setListas] = useState<ListaResponse[]>([])
  const [todos, setTodos] = useState<TodoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [l, t] = await Promise.all([getListas(), getTodos()])
      setListas(l)
      setTodos(t)
    } catch {
      setError('No se pudo cargar la búsqueda')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const q = query.toLowerCase().trim()
  const listasResults = q ? listas.filter((l) => l.name.toLowerCase().includes(q)) : []
  const todosResults = q ? todos.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) : []

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Buscar</h1>

      <input
        type="text"
        placeholder="Buscar listas y tareas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary mb-6"
        autoFocus
      />

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {!q && (
        <p className="text-muted text-sm text-center mt-16">Escribe algo para buscar</p>
      )}

      {q && !loading && listasResults.length === 0 && todosResults.length === 0 && (
        <p className="text-muted text-sm text-center mt-16">Sin resultados para "{query}"</p>
      )}

      {listasResults.length > 0 && (
        <section className="mb-6">
          <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">
            Listas ({listasResults.length})
          </p>
          <div className="flex flex-col gap-2">
            {listasResults.map((l) => (
              <div
                key={l.id}
                onClick={() => router.push(`/listas/${l.id}`)}
                className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition"
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                <div>
                  <p className="text-text text-sm font-medium">{l.name}</p>
                  <p className="text-muted text-xs">Lista</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {todosResults.length > 0 && (
        <section>
          <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">
            Tareas ({todosResults.length})
          </p>
          <div className="flex flex-col gap-2">
            {todosResults.map((t) => (
              <div
                key={t.id}
                onClick={() => t.listaId && router.push(`/listas/${t.listaId}`)}
                className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition"
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${t.completed ? 'bg-primary' : 'border-2 border-border'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${t.completed ? 'line-through text-muted' : 'text-text'}`}>{t.title}</p>
                  {t.description && <p className="text-muted text-xs truncate">{t.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
