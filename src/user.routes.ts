import { Router } from 'express'

const userRouter = Router()

userRouter.get('/users', (req, res) => {
  return res.json({ msg: 'hello users' })
})

export default userRouter
