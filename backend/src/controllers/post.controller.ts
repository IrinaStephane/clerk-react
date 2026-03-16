import { getAuth } from '@clerk/express'
import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma.js'

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req)

    // On récupère les posts liés au userId de Clerk
    const posts = await prisma.post.findMany({
      where: { authorId: userId as string }
    })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
}