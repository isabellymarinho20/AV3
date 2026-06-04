import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/:id/etapas', async (req: Request, res: Response) => {
  const aeronaveId = Number(req.params.id)
  const { nome, prazo } = req.body

  if (!nome || !prazo) {
    return res.status(400).json({ erro: 'Nome e prazo sao obrigatorios' })
  }

  const aeronave = await prisma.aeronave.findUnique({ where: { id: aeronaveId } })
  if (!aeronave) return res.status(404).json({ erro: 'Aeronave nao encontrada' })

  const etapaPendente = await prisma.etapa.findFirst({
    where: { aeronaveId, status: 'Pendente' },
  })
  if (etapaPendente) {
    return res.status(409).json({ erro: 'Nao e possivel adicionar etapa com etapa pendente existente' })
  }

  const etapa = await prisma.etapa.create({
    data: { nome, prazo, status: 'Pendente', aeronaveId },
    include: { funcionarios: { include: { funcionario: true } } },
  })
  return res.status(201).json(etapa)
})

router.patch('/:id/etapas/:etapaId/iniciar', async (req: Request, res: Response) => {
  const etapaId = Number(req.params.etapaId)

  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } })
  if (!etapa) return res.status(404).json({ erro: 'Etapa nao encontrada' })

  if (etapa.status === 'Em Andamento') {
    return res.status(400).json({ erro: 'Etapa ja esta em andamento' })
  }
  if (etapa.status === 'Concluido') {
    return res.status(400).json({ erro: 'Etapa ja foi concluida' })
  }

  const etapaAtualizada = await prisma.etapa.update({
    where: { id: etapaId },
    data: { status: 'Em Andamento' },
    include: { funcionarios: { include: { funcionario: true } } },
  })
  return res.json(etapaAtualizada)
})

router.patch('/:id/etapas/:etapaId/concluir', async (req: Request, res: Response) => {
  const etapaId = Number(req.params.etapaId)

  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } })
  if (!etapa) return res.status(404).json({ erro: 'Etapa nao encontrada' })

  if (etapa.status === 'Concluido') {
    return res.status(400).json({ erro: 'Etapa ja foi concluida' })
  }

  const etapaAtualizada = await prisma.etapa.update({
    where: { id: etapaId },
    data: { status: 'Concluido' },
    include: { funcionarios: { include: { funcionario: true } } },
  })
  return res.json(etapaAtualizada)
})

router.post('/:id/etapas/:etapaId/funcionarios', async (req: Request, res: Response) => {
  const etapaId = Number(req.params.etapaId)
  const { funcionarioId } = req.body

  if (!funcionarioId) return res.status(400).json({ erro: 'funcionarioId e obrigatorio' })

  const etapa = await prisma.etapa.findUnique({ where: { id: etapaId } })
  if (!etapa) return res.status(404).json({ erro: 'Etapa nao encontrada' })

  const funcionario = await prisma.funcionario.findUnique({ where: { id: Number(funcionarioId) } })
  if (!funcionario) return res.status(404).json({ erro: 'Funcionario nao encontrado' })

  const jaAssociado = await prisma.etapaFuncionario.findUnique({
    where: { etapaId_funcionarioId: { etapaId, funcionarioId: Number(funcionarioId) } },
  })
  if (jaAssociado) return res.status(409).json({ erro: 'Funcionario ja associado a esta etapa' })

  await prisma.etapaFuncionario.create({
    data: { etapaId, funcionarioId: Number(funcionarioId) },
  })

  const etapaAtualizada = await prisma.etapa.findUnique({
    where: { id: etapaId },
    include: { funcionarios: { include: { funcionario: true } } },
  })
  return res.status(201).json(etapaAtualizada)
})

export default router
