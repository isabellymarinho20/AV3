import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function upsertFunc(dados: {
  nome: string; telefone: string; endereco: string
  usuario: string; senha: string; nivelPermissao: string; cargo: string
}) {
  return prisma.funcionario.upsert({
    where: { usuario: dados.usuario },
    update: {},
    create: dados,
  })
}

async function assoc(etapaId: number, funcionarioId: number) {
  const existe = await prisma.etapaFuncionario.findUnique({
    where: { etapaId_funcionarioId: { etapaId, funcionarioId } },
  })
  if (!existe) {
    await prisma.etapaFuncionario.create({ data: { etapaId, funcionarioId } })
  }
}

async function main() {
  const f1 = await upsertFunc({
    nome: 'Isabelly Administrativo',
    telefone: '(12) 9999-1001',
    endereco: 'Av. Santos Dumont, 100 - Sao Jose dos Campos',
    usuario: 'isa.admin',
    senha: '123',
    nivelPermissao: 'Administrador',
    cargo: 'Administradora do Sistema',
  })

  await upsertFunc({
    nome: 'Isabelly Engenharia',
    telefone: '(12) 9988-2002',
    endereco: 'Rua Eng. Alvaro Rodrigues, 45 - Sao Jose dos Campos',
    usuario: 'isa.eng',
    senha: '456',
    nivelPermissao: 'Engenheiro',
    cargo: 'Engenheira de Producao',
  })

  const f3 = await upsertFunc({
    nome: 'Operador 01',
    telefone: '(12) 9977-3003',
    endereco: 'Rua das Industrias, 200 - Jacarei',
    usuario: 'operador01',
    senha: '789',
    nivelPermissao: 'Operador',
    cargo: 'Tecnico Operacional',
  })

  const f4 = await upsertFunc({
    nome: 'Operador 02',
    telefone: '(12) 9966-4004',
    endereco: 'Av. Brasil, 350 - Taubate',
    usuario: 'operador02',
    senha: '321',
    nivelPermissao: 'Operador',
    cargo: 'Tecnico de Montagem',
  })

  await upsertFunc({
    nome: 'Engenheiro 01',
    telefone: '(12) 9955-5005',
    endereco: 'Rua XV de Novembro, 78 - Sao Jose dos Campos',
    usuario: 'eng01',
    senha: '654',
    nivelPermissao: 'Engenheiro',
    cargo: 'Engenheiro de Testes',
  })

  await upsertFunc({
    nome: 'Isabelly Operacoes',
    telefone: '(12) 9944-6006',
    endereco: 'Rua Paraiba, 12 - Sao Jose dos Campos',
    usuario: 'isa.op',
    senha: '987',
    nivelPermissao: 'Operador',
    cargo: 'Operadora de Linha',
  })

  // Aeronave 1
  const a1 = await prisma.aeronave.upsert({
    where: { codigo: 'A001' },
    update: {},
    create: { codigo: 'A001', modelo: 'Aviao Comercial 1', tipo: 'Comercial', capacidade: 10, alcance: 3650 },
  })

  const pecasA1 = await prisma.peca.findMany({ where: { aeronaveId: a1.id } })
  if (pecasA1.length === 0) {
    await prisma.peca.create({ data: { nome: 'Motor 1', tipo: 'Importada', fornecedor: 'Embraer', status: 'Pronta', aeronaveId: a1.id } })
  }

  const etapasA1 = await prisma.etapa.findMany({ where: { aeronaveId: a1.id } })
  if (etapasA1.length === 0) {
    const e1 = await prisma.etapa.create({ data: { nome: 'Montagem', prazo: '2025-03-10', status: 'Concluido', aeronaveId: a1.id } })
    await assoc(e1.id, f1.id)
    await assoc(e1.id, f3.id)
  }

  const testesA1 = await prisma.teste.findMany({ where: { aeronaveId: a1.id } })
  if (testesA1.length === 0) {
    await prisma.teste.create({ data: { tipo: 'Eletrico', resultado: 'Aprovado', aeronaveId: a1.id } })
  }

  // Aeronave 2
  const a2 = await prisma.aeronave.upsert({
    where: { codigo: 'A002' },
    update: {},
    create: { codigo: 'A002', modelo: 'Aviao Militar 2', tipo: 'Militar', capacidade: 1, alcance: 4000 },
  })

  const pecasA2 = await prisma.peca.findMany({ where: { aeronaveId: a2.id } })
  if (pecasA2.length === 0) {
    await prisma.peca.create({ data: { nome: 'Motor 2', tipo: 'Importada', fornecedor: 'Embraer', status: 'Em Transporte', aeronaveId: a2.id } })
  }

  const etapasA2 = await prisma.etapa.findMany({ where: { aeronaveId: a2.id } })
  if (etapasA2.length === 0) {
    const e2 = await prisma.etapa.create({ data: { nome: 'Integracao', prazo: '2025-04-15', status: 'Em Andamento', aeronaveId: a2.id } })
    await assoc(e2.id, f4.id)
  }

  const testesA2 = await prisma.teste.findMany({ where: { aeronaveId: a2.id } })
  if (testesA2.length === 0) {
    await prisma.teste.create({ data: { tipo: 'Aerodinamico', resultado: 'Aprovado', aeronaveId: a2.id } })
  }

  console.log('Seed executado com sucesso!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
