import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (_req: Request, res: Response) => {
  const aeronaves = await prisma.aeronave.findMany({
    include: {
      pecas: true,
      etapas: {
        include: {
          funcionarios: { include: { funcionario: true } },
        },
      },
      testes: true,
    },
  })
  return res.json(aeronaves)
})

router.get('/:id', async (req: Request, res: Response) => {
  const aeronave = await prisma.aeronave.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      pecas: true,
      etapas: {
        include: { funcionarios: { include: { funcionario: true } } },
      },
      testes: true,
    },
  })
  if (!aeronave) return res.status(404).json({ erro: 'Aeronave nao encontrada' })
  return res.json(aeronave)
})

router.post('/', async (req: Request, res: Response) => {
  const { codigo, modelo, tipo, capacidade, alcance } = req.body

  if (!codigo || !modelo || !tipo || !capacidade || !alcance) {
    return res.status(400).json({ erro: 'Todos os campos sao obrigatorios' })
  }

  if (capacidade <= 0 || alcance <= 0) {
    return res.status(400).json({ erro: 'Capacidade e alcance devem ser maiores que zero' })
  }

  const existente = await prisma.aeronave.findUnique({ where: { codigo } })
  if (existente) return res.status(409).json({ erro: 'Codigo ja cadastrado' })

  const aeronave = await prisma.aeronave.create({
    data: { codigo, modelo, tipo, capacidade: Number(capacidade), alcance: Number(alcance) },
    include: { pecas: true, etapas: true, testes: true },
  })
  return res.status(201).json(aeronave)
})

export default router
