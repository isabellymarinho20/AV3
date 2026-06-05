import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()
//*********BRASILL************* */
router.post('/:id/pecas', async (req: Request, res: Response) => {
  const aeronaveId = Number(req.params.id)
  const { nome, tipo, fornecedor, status } = req.body

  if (!nome || !tipo || !fornecedor || !status) {
    return res.status(400).json({ erro: 'Todos os campos sao obrigatorios' })
  }

  const aeronave = await prisma.aeronave.findUnique({ where: { id: aeronaveId } })
  if (!aeronave) return res.status(404).json({ erro: 'Aeronave nao encontrada' })

  const peca = await prisma.peca.create({
    data: { nome, tipo, fornecedor, status, aeronaveId },
  })
  return res.status(201).json(peca)
})

router.patch('/:id/pecas/:pecaId', async (req: Request, res: Response) => {
  const pecaId = Number(req.params.pecaId)
  const { status } = req.body

  if (!status) return res.status(400).json({ erro: 'Status e obrigatorio' })

  const peca = await prisma.peca.findUnique({ where: { id: pecaId } })
  if (!peca) return res.status(404).json({ erro: 'Peca nao encontrada' })

  const pecaAtualizada = await prisma.peca.update({
    where: { id: pecaId },
    data: { status },
  })
  return res.json(pecaAtualizada)
})

export default router
