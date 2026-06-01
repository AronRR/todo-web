'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const token = await cred.user.getIdToken()
      document.cookie = `firebaseToken=${token}; path=/; max-age=604800`
      router.push('/')
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl p-8 border border-border">
        <h1 className="text-2xl font-bold text-text mb-1">Bienvenido</h1>
        <p className="text-muted text-sm mb-8">Inicia sesión para continuar</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-bg border border-border rounded-lg px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="Contraseña"
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
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="text-muted text-sm text-center mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary font-semibold">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
