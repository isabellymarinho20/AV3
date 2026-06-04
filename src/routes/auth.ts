import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/login', async (req: Request, res: Response) => {
  const { usuario, senha } = req.body

  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Usuario e senha sao obrigatorios' })
  }

  const funcionario = await prisma.funcionario.findUnique({ where: { usuario } })

  if (!funcionario || funcionario.senha !== senha) {
    return res.status(401).json({ erro: 'Usuario ou senha incorretos' })
  }

  const { senha: _, ...dadosSeguros } = funcionario
  return res.json(dadosSeguros)
})

export default router
