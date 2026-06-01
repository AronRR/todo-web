'use client'
import { useState } from 'react'
import Modal from './Modal'

const COLORS = ['#6366f1','#ec4899','#f59e0b','#22c55e','#06b6d4','#f97316','#8b5cf6','#ef4444']

type Props = {
  initial?: { name: string; color: string }
  onSave: (data: { name: string; color: string }) => Promise<void>
  onClose: () => void
}

export default function CreateListModal({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [color, setColor] = useState(initial?.color ?? COLORS[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!name.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true)
    try {
      await onSave({ name: name.trim(), color })
      onClose()
    } catch {
      setError('No se pudo guardar la lista')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial ? 'Editar lista' : 'Nueva lista'} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre de la lista"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary w-full"
          autoFocus
        />
        <div>
          <p className="text-muted text-sm mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full transition"
                style={{ backgroundColor: c, outline: color === c ? `3px solid white` : 'none', outlineOffset: '2px' }}
              />
            ))}
          </div>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-muted text-sm hover:text-text transition">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg disabled:opacity-50 hover:bg-indigo-500 transition"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
