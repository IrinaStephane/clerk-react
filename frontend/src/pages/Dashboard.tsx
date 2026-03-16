import { useUser, useClerk, useAuth } from "@clerk/react"
import { useState, useEffect } from "react"

interface Tournament {
  id: number;
  title: string;
}

export default function Dashboard() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { getToken } = useAuth()
  
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [newTitle, setNewTitle] = useState("")

  // Charger les tournois au démarrage
  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    const token = await getToken()
    const res = await fetch("http://localhost:3000/api/tournaments", {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setTournaments(data)
  }

  const createTournament = async () => {
    if (!newTitle) return
    const token = await getToken()
    await fetch("http://localhost:3000/api/tournaments", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ title: newTitle })
    })
    setNewTitle("")
    fetchTournaments()
  }

  return (
    <div>
      <h1>Tableau de bord de {user?.firstName}</h1>
      
      <section>
        <h3>Créer un tournoi</h3>
        <input 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)} 
          placeholder="Nom du tournoi"
        />
        <button onClick={createTournament}>Ajouter</button>
      </section>

      <hr />

      <section>
        <h3>Mes Tournois</h3>
        <ul>
          {tournaments.map(t => (
            <li key={t.id}>{t.title}</li>
          ))}
        </ul>
      </section>

      <button onClick={() => signOut(() => window.location.href = "/")}>
        Déconnexion
      </button>
    </div>
  )
}