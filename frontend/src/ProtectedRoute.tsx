import { Navigate } from "react-router-dom"
import { useUser } from "@clerk/react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Navigate to="/login" />
  }

  return children
}