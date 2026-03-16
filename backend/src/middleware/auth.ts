import { getAuth } from '@clerk/express'
import type { Request, Response, NextFunction } from 'express'

export const authenticateClerk = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req)
  
  if (!userId) {
    res.status(401).json({ message: 'Non autorisé' })
    return
  }
  
  next()
}