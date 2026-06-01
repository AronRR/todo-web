'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login')
      } else {
        user.getIdToken().then((token) => {
          document.cookie = `firebaseToken=${token}; path=/; max-age=604800`
        })
        setReady(true)
      }
    })
    return unsub
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <span className="text-muted text-sm">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 ml-56 p-8">{children}</main>
    </div>
  )
}
