'use client'
import { useState } from 'react'
import Modal from './Modal'
import { Priority, TodoResponse } from '@/lib/api/todos'

type Props = {
  initial?: TodoResponse
  onSave: (data: { title: string; description: string; priority: Priority; dueDate?: string }) => Promise<void>
  onClose: () => void
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
]

export default function TaskModal({ initial, onSave, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleDueDate = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8)
    let formatted = digits
    if (digits.length > 4) formatted = digits.slice(0, 4) + '-' + digits.slice(4)
    if (digits.length > 6) formatted = digits.slice(0, 4) + '-' + digits.slice(4, 6) + '-' + digits.slice(6)
    setDueDate(formatted)
  }

  const handleSave = async () => {
    if (!title.trim()) { setError('El título es obligatorio'); return }
    setSaving(true)
    try {
      await onSave({ title: title.trim(), description: description.trim(), priority, dueDate: dueDate.length === 10 ? dueDate : undefined })
      onClose()
    } catch {
      setError('No se pudo guardar la tarea')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary w-full"

  return (
    <Modal title={initial ? 'Editar tarea' : 'Nueva tarea'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} autoFocus />
        <textarea placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
        <input type="text" placeholder="Fecha límite (AAAA-MM-DD)" value={dueDate} onChange={(e) => handleDueDate(e.target.value)} className={inputClass} maxLength={10} />
        <div>
          <p className="text-muted text-sm mb-2">Prioridad</p>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  priority === p.value ? 'bg-primary text-white' : 'bg-bg border border-border text-muted hover:text-text'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-muted text-sm hover:text-text transition">Cancelar</button>
          <button onClick={handleSave} disabled={saving || !title.trim()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg disabled:opacity-50 hover:bg-indigo-500 transition">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
