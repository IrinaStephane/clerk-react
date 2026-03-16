import 'dotenv/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import { prisma } from '../../lib/prisma.js'

const jwtSecret = process.env.JWT_SECRET as string
const saltRounds = Number(process.env.SALT_ROUNDS ?? 10)

/* ===================== SIGNUP ===================== */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name: string
      email: string
      password: string
    }

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Missing fields' })
      return
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ message: 'Email already used' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' })
      return
    }

    const hashed = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    })

    res.status(201).json({ message: 'success', userId: user.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ===================== LOGIN ===================== */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string
      password: string
    }

    if (!email || !password) {
      res.status(400).json({ message: 'Missing fields' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ message: "This email doesn't exist" })
      return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ message: 'Wrong password. Try again' })
      return
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ===================== GET ME ===================== */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userPayload = req.user as JwtPayload | undefined

    if (!userPayload?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: userPayload.id as number },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  } catch (error) {
    console.error('Error in getMe:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
