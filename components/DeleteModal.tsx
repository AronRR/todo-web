'use client'
import { useState } from 'react'
import Modal from './Modal'

type Props = {
  itemName: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

export default function DeleteModal({ itemName, onConfirm, onClose }: Props) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false) }
  }

  return (
    <Modal title="Confirmar eliminación" onClose={onClose}>
      <p className="text-muted text-sm mb-6">¿Eliminar <span className="text-text font-medium">"{itemName}"</span>? Esta acción no se puede deshacer.</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-muted text-sm hover:text-text transition">Cancelar</button>
        <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 bg-danger text-white text-sm font-semibold rounded-lg disabled:opacity-50 hover:bg-red-500 transition">
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  )
}
