import { useEffect, useState } from "react"
import { useAuth, useClerk, useUser } from "@clerk/react"

export default function Dashboard() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [dbUser, setDbUser] = useState<any>(null)
  const { signOut } = useClerk()

  function logout() {
    signOut(() => {
      window.location.href = "/"
    })
  }


  useEffect(() => {
    const syncUser = async () => {
      try {
        const token = await getToken()
        const response = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setDbUser(data)
        }
      } catch (err) {
        console.error("Erreur de synchro:", err)
      }
    }

    syncUser()
  }, [getToken])

  return (
    <div>
      <h1>Tableau de Bord</h1>
      <p>Connecté en tant que : {user?.primaryEmailAddress?.emailAddress}</p>
      
      <hr />
      <button onClick={logout}>
        Logout
      </button>
      <h2>Mes informations en base de données :</h2>
      {dbUser ? (
        <div>
          
          <p>ID Prisma : {dbUser.id}</p>
          <p>Nom : {dbUser.name}</p>
          <h3>Mes Posts :</h3>
          {dbUser.posts?.length > 0 ? (
            <ul>
              {dbUser.posts.map((p: any) => <li key={p.id}>{p.title}</li>)}
            </ul>
          ) : <p>Aucun post.</p>}
        </div>
      ) : (
        <p>Synchronisation avec la base de données...</p>
      )}
    </div>
  )
}