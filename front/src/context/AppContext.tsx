import { useState, createContext, useContext, useCallback, useEffect, ReactNode } from 'react'
import { api } from '../services/api'
import type {
  Aeronave, Funcionario, Peca, Etapa, Teste,
  ToastState, AppContextValue, NivelPermissao,
} from '../types'

export const ENUMS = {
  TipoAeronave:   ['Comercial', 'Militar']                           as const,
  TipoPeca:       ['Nacional', 'Importada']                          as const,
  StatusPeca:     ['Em Produção', 'Em Transporte', 'Pronta']         as const,
  StatusEtapa:    ['Pendente', 'Em Andamento', 'Concluido']          as const,
  NivelPermissao: ['Administrador', 'Engenheiro', 'Operador']        as const,
  TipoTeste:      ['Eletrico', 'Hidraulico', 'Aerodinamico']         as const,
  ResultadoTeste: ['Aprovado', 'Reprovado']                          as const,
}

function normalizarAeronave(raw: any): Aeronave {
  return {
    id: raw.id,
    codigo: raw.codigo,
    modelo: raw.modelo,
    tipo: raw.tipo,
    capacidade: raw.capacidade,
    alcance: raw.alcance,
    pecas: (raw.pecas || []).map((p: any) => ({
      id: p.id,
      nome: p.nome,
      tipo: p.tipo,
      fornecedor: p.fornecedor,
      status: p.status,
    })),
    etapas: (raw.etapas || []).map((e: any) => ({
      id: e.id,
      nome: e.nome,
      status: e.status,
      prazo: e.prazo,
      funcionarios: (e.funcionarios || []).map((ef: any) => ef.funcionarioId ?? ef.funcionario?.id),
    })),
    testes: (raw.testes || []).map((t: any) => ({
      id: t.id,
      tipo: t.tipo,
      resultado: t.resultado,
    })),
  }
}

export const AppCtx = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Funcionario | null>(null)
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [toast, setToast] = useState<ToastState | null>(null)
  const [carregando, setCarregando] = useState(false)

  const notify = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const carregarDados = useCallback(async () => {
    setCarregando(true)
    try {
      const [aeros, funcs] = await Promise.all([
        api.getAeronaves() as Promise<any[]>,
        api.getFuncionarios() as Promise<any[]>,
      ])
      setAeronaves(aeros.map(normalizarAeronave))
      setFuncionarios(funcs.map(f => ({
        id: f.id,
        nome: f.nome,
        telefone: f.telefone,
        endereco: f.endereco,
        usuario: f.usuario,
        senha: '',
        nivel: f.nivelPermissao as NivelPermissao,
        cargo: f.cargo,
      })))
    } catch {
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    if (user) carregarDados()
  }, [user, carregarDados])

  const login = async (usuario: string, senha: string): Promise<boolean> => {
    try {
      const dados = await api.login(usuario, senha) as any
      setUser({
        id: dados.id,
        nome: dados.nome,
        telefone: dados.telefone,
        endereco: dados.endereco,
        usuario: dados.usuario,
        senha: '',
        nivel: dados.nivelPermissao as NivelPermissao,
        cargo: dados.cargo,
      })
      return true
    } catch (e: any) {
      notify(e.message || 'Usuario ou senha incorretos', 'error')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setAeronaves([])
    setFuncionarios([])
  }

  const addAeronave = async (data: Omit<Aeronave, 'id' | 'pecas' | 'etapas' | 'testes'>): Promise<boolean> => {
    try {
      const nova = await api.createAeronave(data) as any
      setAeronaves(prev => [...prev, normalizarAeronave(nova)])
      notify('Aeronave cadastrada com sucesso!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao cadastrar aeronave', 'error')
      return false
    }
  }

  const addPeca = async (aeroId: number, peca: Peca): Promise<boolean> => {
    try {
      const nova = await api.addPeca(aeroId, peca) as any
      setAeronaves(prev => prev.map(a =>
        a.id === aeroId ? { ...a, pecas: [...a.pecas, { id: nova.id, ...peca }] } : a
      ))
      notify('Peca adicionada!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao adicionar peca', 'error')
      return false
    }
  }

  const updateStatusPeca = async (aeroId: number, pecaId: number, newStatus: string): Promise<void> => {
    try {
      await api.updatePecaStatus(aeroId, pecaId, newStatus)
      setAeronaves(prev => prev.map(a =>
        a.id === aeroId
          ? { ...a, pecas: a.pecas.map((p: any) => p.id === pecaId ? { ...p, status: newStatus } : p) }
          : a
      ))
      notify('Status da peca atualizado!')
    } catch (e: any) {
      notify(e.message || 'Erro ao atualizar status', 'error')
    }
  }

  const addEtapa = async (aeroId: number, etapa: Omit<Etapa, 'id' | 'funcionarios'>): Promise<boolean> => {
    try {
      const nova = await api.addEtapa(aeroId, etapa) as any
      setAeronaves(prev => prev.map(a =>
        a.id === aeroId
          ? { ...a, etapas: [...a.etapas, { id: nova.id, nome: nova.nome, prazo: nova.prazo, status: nova.status, funcionarios: [] }] }
          : a
      ))
      notify('Etapa adicionada!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao adicionar etapa', 'error')
      return false
    }
  }

  const iniciarEtapa = async (aeroId: number, etapaId: number): Promise<boolean> => {
    try {
      await api.iniciarEtapa(aeroId, etapaId)
      setAeronaves(prev => prev.map(a =>
        a.id === aeroId
          ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, status: 'Em Andamento' } : e) }
          : a
      ))
      notify('Etapa iniciada!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao iniciar etapa', 'error')
      return false
    }
  }

  const concluirEtapa = async (aeroId: number, etapaId: number): Promise<boolean> => {
    try {
      await api.concluirEtapa(aeroId, etapaId)
      setAeronaves(prev => prev.map(a =>
        a.id === aeroId
          ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, status: 'Concluido' } : e) }
          : a
      ))
      notify('Etapa concluida!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao concluir etapa', 'error')
      return false
    }
  }

  const addFuncionario = async (data: Omit<Funcionario, 'id'>): Promise<boolean> => {
    try {
      const novo = await api.createFuncionario({
        nome: data.nome,
        telefone: data.telefone,
        endereco: data.endereco,
        usuario: data.usuario,
        senha: data.senha,
        nivelPermissao: data.nivel,
        cargo: data.cargo,
      }) as any
      setFuncionarios(prev => [...prev, {
        id: novo.id,
        nome: novo.nome,
        telefone: novo.telefone,
        endereco: novo.endereco,
        usuario: novo.usuario,
        senha: '',
        nivel: novo.nivelPermissao as NivelPermissao,
        cargo: novo.cargo,
      }])
      notify('Funcionario cadastrado!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao cadastrar funcionario', 'error')
      return false
    }
  }

  const assocFuncionario = async (aeroId: number, etapaId: number, funcId: number): Promise<boolean> => {
    try {
      await api.assocFuncionario(aeroId, etapaId, funcId)
      setAeronaves(prev => prev.map(a =>
        a.id === aeroId
          ? {
            ...a,
            etapas: a.etapas.map(e =>
              e.id === etapaId && !e.funcionarios.includes(funcId)
                ? { ...e, funcionarios: [...e.funcionarios, funcId] }
                : e
            ),
          }
          : a
      ))
      notify('Funcionario associado a etapa!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao associar funcionario', 'error')
      return false
    }
  }

  const deleteFuncionario = async (id: number): Promise<boolean> => {
    try {
      await api.deleteFuncionario(id)
      setFuncionarios(prev => prev.filter(f => f.id !== id))
      notify('Funcionário removido!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao remover funcionário', 'error')
      return false
    }
  }

  const addTeste = async (aeroId: number, teste: Teste): Promise<boolean> => {
    try {
      const novo = await api.addTeste(aeroId, teste) as any
      setAeronaves(prev => prev.map(a =>
        a.id === aeroId ? { ...a, testes: [...a.testes, { id: novo.id, tipo: novo.tipo, resultado: novo.resultado }] } : a
      ))
      notify('Teste registrado!')
      return true
    } catch (e: any) {
      notify(e.message || 'Erro ao registrar teste', 'error')
      return false
    }
  }

  return (
    <AppCtx.Provider value={{
      user, login, logout,
      aeronaves, funcionarios,
      toast, notify,
      carregando,
      addAeronave, addPeca, updateStatusPeca,
      addEtapa, iniciarEtapa, concluirEtapa,
      addFuncionario, assocFuncionario, deleteFuncionario,
      addTeste,
    } as any}>
      {children}
    </AppCtx.Provider>
  )
}
