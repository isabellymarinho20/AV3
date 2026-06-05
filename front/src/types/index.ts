export type TipoAeronave  = 'Comercial' | 'Militar'
export type TipoPeca      = 'Nacional' | 'Importada'
export type StatusPeca    = 'Em Produção' | 'Em Transporte' | 'Pronta'
export type StatusEtapa   = 'Pendente' | 'Em Andamento' | 'Concluido'
export type NivelPermissao = 'Administrador' | 'Engenheiro' | 'Operador'
export type TipoTeste     = 'Eletrico' | 'Hidraulico' | 'Aerodinamico'
export type ResultadoTeste = 'Aprovado' | 'Reprovado'
export type ToastType     = 'success' | 'error'
//*********BRASILL************* */
export type View =
  | 'dashboard'
  | 'aeronaves'
  | 'aeroDetalhe'
  | 'pecas'
  | 'etapas'
  | 'testes'
  | 'funcionarios'
  | 'relatorio'

export interface Peca {
  id?: number
  nome: string
  tipo: TipoPeca
  fornecedor: string
  status: StatusPeca
}

export interface Etapa {
  id: number
  nome: string
  status: StatusEtapa
  prazo: string
  funcionarios: number[]
}

export interface Teste {
  id?: number
  tipo: TipoTeste
  resultado: ResultadoTeste
}

export interface Aeronave {
  id: number
  codigo: string
  modelo: string
  tipo: TipoAeronave
  capacidade: number
  alcance: number
  pecas: Peca[]
  etapas: Etapa[]
  testes: Teste[]
}

export interface Funcionario {
  id: number
  nome: string
  telefone: string
  endereco: string
  usuario: string
  senha: string
  nivel: NivelPermissao
  cargo: string
}

export interface ToastState {
  msg: string
  type: ToastType
}

export interface AppContextValue {
  user: Funcionario | null
  login: (usuario: string, senha: string) => Promise<boolean>
  logout: () => void
  aeronaves: Aeronave[]
  funcionarios: Funcionario[]
  toast: ToastState | null
  notify: (msg: string, type?: ToastType) => void
  carregando: boolean
  addAeronave: (data: Omit<Aeronave, 'id' | 'pecas' | 'etapas' | 'testes'>) => Promise<boolean>
  addPeca: (aeroId: number, peca: Peca) => Promise<boolean>
  updateStatusPeca: (aeroId: number, pecaId: number, newStatus: StatusPeca) => Promise<void>
  addEtapa: (aeroId: number, etapa: Omit<Etapa, 'id' | 'funcionarios'>) => Promise<boolean>
  iniciarEtapa: (aeroId: number, etapaId: number) => Promise<boolean>
  concluirEtapa: (aeroId: number, etapaId: number) => Promise<boolean>
  addFuncionario: (data: Omit<Funcionario, 'id'>) => Promise<boolean>
  assocFuncionario: (aeroId: number, etapaId: number, funcId: number) => Promise<boolean>
  deleteFuncionario: (id: number) => Promise<boolean>
  addTeste: (aeroId: number, teste: Teste) => Promise<boolean>
}
