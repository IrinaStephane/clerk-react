import 'dotenv/config'
import cors from "cors"
import express from 'express'
import { authRoutes } from './src/routes';

const PORT = process.env.PORT;
const app = express()

app.use(cors());
app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});