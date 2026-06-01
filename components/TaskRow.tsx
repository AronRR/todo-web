import { TodoResponse } from '@/lib/api/todos'

type Props = {
  todo: TodoResponse
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }

function isOverdue(dueDate?: string | null, completed?: boolean) {
  if (!dueDate || completed) return false
  return dueDate < new Date().toISOString().slice(0, 10)
}

export default function TaskRow({ todo, onToggle, onEdit, onDelete }: Props) {
  const overdue = isOverdue(todo.dueDate, todo.completed)

  return (
    <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl group hover:border-primary/30 transition">
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
          todo.completed ? 'bg-primary border-primary' : 'border-border hover:border-primary'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${todo.completed ? 'line-through text-muted' : 'text-text'}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-xs text-muted truncate mt-0.5">{todo.description}</p>
        )}
        {todo.dueDate && (
          <p className={`text-xs mt-0.5 ${overdue ? 'text-danger' : 'text-muted'}`}>
            {overdue ? 'Vencida: ' : 'Fecha: '}{todo.dueDate}
          </p>
        )}
      </div>
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: PRIORITY_COLORS[todo.priority ?? 'medium'] }}
        title={todo.priority}
      />
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button onClick={onEdit} className="text-muted hover:text-text text-xs px-2 py-1 rounded bg-border">Editar</button>
        <button onClick={onDelete} className="text-danger text-xs px-2 py-1 rounded bg-border">Eliminar</button>
      </div>
    </div>
  )
}
