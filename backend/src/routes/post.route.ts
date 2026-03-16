import express from 'express'
import { requireAuth } from '@clerk/express'
import { getAuth } from '@clerk/express'
import { prisma } from '../../lib/prisma'

const router = express.Router()

router.get('/', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req)
  
  const posts = await prisma.post.findMany({
    where: { authorId: userId as string }
  })
  
  res.json(posts)
})

export default router