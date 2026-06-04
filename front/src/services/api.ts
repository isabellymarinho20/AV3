async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.erro || 'Erro na requisicao')
  return data as T
}

export const api = {
  login: (usuario: string, senha: string) =>
    req('/auth/login', { method: 'POST', body: JSON.stringify({ usuario, senha }) }),

  getAeronaves: () => req('/aeronaves'),
  createAeronave: (data: object) =>
    req('/aeronaves', { method: 'POST', body: JSON.stringify(data) }),

  getFuncionarios: () => req('/funcionarios'),
  createFuncionario: (data: object) =>
    req('/funcionarios', { method: 'POST', body: JSON.stringify(data) }),

  addPeca: (aeroId: number, data: object) =>
    req(`/aeronaves/${aeroId}/pecas`, { method: 'POST', body: JSON.stringify(data) }),
  updatePecaStatus: (aeroId: number, pecaId: number, status: string) =>
    req(`/aeronaves/${aeroId}/pecas/${pecaId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  addEtapa: (aeroId: number, data: object) =>
    req(`/aeronaves/${aeroId}/etapas`, { method: 'POST', body: JSON.stringify(data) }),
  iniciarEtapa: (aeroId: number, etapaId: number) =>
    req(`/aeronaves/${aeroId}/etapas/${etapaId}/iniciar`, { method: 'PATCH' }),
  concluirEtapa: (aeroId: number, etapaId: number) =>
    req(`/aeronaves/${aeroId}/etapas/${etapaId}/concluir`, { method: 'PATCH' }),
  assocFuncionario: (aeroId: number, etapaId: number, funcionarioId: number) =>
    req(`/aeronaves/${aeroId}/etapas/${etapaId}/funcionarios`, { method: 'POST', body: JSON.stringify({ funcionarioId }) }),

  addTeste: (aeroId: number, data: object) =>
    req(`/aeronaves/${aeroId}/testes`, { method: 'POST', body: JSON.stringify(data) }),

  deleteFuncionario: (id: number) =>
    req(`/funcionarios/${id}`, { method: 'DELETE' }),
}
