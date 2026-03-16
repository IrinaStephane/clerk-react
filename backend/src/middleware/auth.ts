import 'dotenv/config'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

const jwtSecret = process.env.JWT_SECRET as string

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Token missing' })
    return
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload
    req.user = payload
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' })
  }
}
