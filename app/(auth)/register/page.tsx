'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api/client'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!fullName || !email || !password) { setError('Completa todos los campos'); return }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    setLoading(true)
    let firebaseUser = null
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      firebaseUser = cred.user
      await api.post('/users', { fullName, email, firebaseUuid: firebaseUser.uid })
      const token = await firebaseUser.getIdToken()
      document.cookie = `firebaseToken=${token}; path=/; max-age=604800`
      router.push('/')
    } catch (e: any) {
      if (firebaseUser) await deleteUser(firebaseUser).catch(() => {})
      setError(e.response?.data || e.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 border border-border">
        <h1 className="text-2xl font-bold text-text mb-1">Crear cuenta</h1>
        <p className="text-muted text-sm mb-8">Regístrate para empezar</p>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="Contraseña (mín. 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary"
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-semibold py-3 rounded-lg disabled:opacity-50 hover:bg-indigo-500 transition"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-muted text-sm text-center mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
