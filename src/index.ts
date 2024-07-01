import express from 'express'
import userRouter from './user.routes'

const PORT = 3000

const app = express()
const router = express.Router()

// middleware
// middleware that is specific to this router
const timeLog = (req: any, res: any, next: any) => {
  console.log(`Time: \x1b[32m${new Date().toISOString()}\x1b[0m`)
  next()
}
router.use(timeLog)

app.use('/api', router, userRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
