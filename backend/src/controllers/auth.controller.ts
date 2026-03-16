import { clerkClient, getAuth } from '@clerk/express'
import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma.js'

/* REMARQUE : On n'a plus besoin de signup() ou login() ici car 
  Clerk gère ça via Google SSO sur ton front.
*/

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      res.status(401).json({ message: 'Non autorisé' })
      return
    }

    // 1. Chercher l'utilisateur dans Prisma
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { posts: true }
    })

    // 2. S'il n'existe pas encore, on le crée (Synchronisation automatique)
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId)
      
      const email = clerkUser.emailAddresses[0]?.emailAddress || ""
      const name = `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || "Utilisateur"

      user = await prisma.user.create({
        data: {
          id: userId, // Utilise l'ID de Clerk
          email: email,
          name: name,
        },
        include: { posts: true }
      })
    }

    res.json(user)
  } catch (error) {
    console.error('Erreur dans getMe:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// Optionnel : Une fonction pour enregistrer l'utilisateur s'il est nouveau
export const syncUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = getAuth(req)
        const { email, name } = req.body as { email: string; name: string }

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        const user = await prisma.user.upsert({
            where: { id: userId },
            update: { name },
            create: {
                id: userId,
                email,
                name,
            },
        })

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la synchronisation' })
    }
}