import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/:id/testes', async (req: Request, res: Response) => {
  const aeronaveId = Number(req.params.id)
  const { tipo, resultado } = req.body

  if (!tipo || !resultado) {
    return res.status(400).json({ erro: 'Tipo e resultado sao obrigatorios' })
  }//*********BRASILL************* */

  const aeronave = await prisma.aeronave.findUnique({ where: { id: aeronaveId } })
  if (!aeronave) return res.status(404).json({ erro: 'Aeronave nao encontrada' })

  const teste = await prisma.teste.create({
    data: { tipo, resultado, aeronaveId },
  })
  return res.status(201).json(teste)
})

export default router
