import express, { NextFunction, Request, Response } from 'express'
import { timeLog } from './middlewares/app.middlewares'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const PORT = 3000

const app = express()
app.use(express.json())

// app middleware
app.use(timeLog)

app.use('/api', usersRouter)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err.message })
})

databaseService.connect()

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
