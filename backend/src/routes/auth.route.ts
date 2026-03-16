import express from 'express'
import { getMe, syncUser } from '../controllers/auth.controller'
import { requireAuth } from '@clerk/express'

const router = express.Router()

// Route pour récupérer mon profil et mes posts
// requireAuth() bloque l'accès si le jeton Clerk est absent ou invalide
router.get('/me', requireAuth(), getMe)

// Route pour synchroniser les infos du front vers la DB
router.post('/sync', requireAuth(), syncUser)

export default router