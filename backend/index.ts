import express from 'express'
import cors from "cors"
import { clerkMiddleware } from '@clerk/express'
import authRoutes from './src/routes/auth.route'
import postRoutes from './src/routes/post.route'

const app = express()


app.use(cors());
app.use(clerkMiddleware()) // Très important : à placer avant les routes
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})