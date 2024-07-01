import express from 'express'
import { timeLog } from './middlewares/app.middlewares'
import usersRouter from './routes/users.routes'

const PORT = 3000

const app = express()
app.use(express.json())

// app middleware
app.use(timeLog)

app.use('/api', usersRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
