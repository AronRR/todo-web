type Props = {
  title: string
  color: string
  taskCount: number
  completedCount: number
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function ListCard({ title, color, taskCount, completedCount, onClick, onEdit, onDelete }: Props) {
  const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0

  return (
    <div
      className="bg-surface border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition group"
      onClick={onClick}
    >
      <div className="h-1 w-full" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-text font-semibold truncate flex-1">{title}</h3>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition ml-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={onEdit} className="text-muted hover:text-text text-xs px-2 py-1 rounded bg-border">Editar</button>
            <button onClick={onDelete} className="text-danger hover:text-red-400 text-xs px-2 py-1 rounded bg-border">Eliminar</button>
          </div>
        </div>
        <p className="text-muted text-sm mt-2">{completedCount}/{taskCount} tareas</p>
        <div className="mt-3 h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ backgroundColor: color, width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
