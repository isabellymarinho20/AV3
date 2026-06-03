import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (_req: Request, res: Response) => {
  const funcionarios = await prisma.funcionario.findMany({
    select: {
      id: true, nome: true, telefone: true,
      endereco: true, usuario: true,
      nivelPermissao: true, cargo: true,
    },
  })
  return res.json(funcionarios)
})

router.post('/', async (req: Request, res: Response) => {
  const { nome, telefone, endereco, usuario, senha, nivelPermissao, cargo } = req.body

  if (!nome || !telefone || !endereco || !usuario || !senha || !nivelPermissao || !cargo) {
    return res.status(400).json({ erro: 'Todos os campos sao obrigatorios' })
  }

  const conflito = await prisma.funcionario.findFirst({
    where: {
      OR: [
        { nome },
        { usuario },
        { senha },
      ],
    },
  })

  if (conflito) {
    if (conflito.nome === nome)
      return res.status(409).json({ erro: 'Ja existe um funcionario com este nome' })
    if (conflito.usuario === usuario)
      return res.status(409).json({ erro: 'Ja existe um funcionario com este usuario' })
    if (conflito.senha === senha)
      return res.status(409).json({ erro: 'Ja existe um funcionario com esta senha' })
  }

  const funcionario = await prisma.funcionario.create({
    data: { nome, telefone, endereco, usuario, senha, nivelPermissao, cargo },
    select: {
      id: true, nome: true, telefone: true,
      endereco: true, usuario: true,
      nivelPermissao: true, cargo: true,
    },
  })
  return res.status(201).json(funcionario)
})

router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const funcionario = await prisma.funcionario.findUnique({ where: { id } })
  if (!funcionario) return res.status(404).json({ erro: 'Funcionario nao encontrado' })

  await prisma.funcionario.delete({ where: { id } })
  return res.json({ ok: true })
})

export default router
