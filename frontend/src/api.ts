import type {
  AlunoMediaGeralDto,
  Atribuicao,
  Avaliacao,
  AvaliacaoQuestao,
  Questao,
  QuestaoMaisDificilDto,
  QuestaoMaisErrosDto,
  Resposta,
  Usuario,
} from './types';

export const API_BASE_URL = 'http://localhost:8080';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const text = await res.text();

  if (!res.ok) {
    let message = text || `Erro HTTP ${res.status}`;
    try {
      const json = JSON.parse(text);
      if (json.message) message = json.message;
      else if (json.error) message = json.error;
    } catch {
      // mantém texto retornado pelo backend
    }
    throw new Error(message);
  }

  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  usuarios: {
    listar: () => request<Usuario[]>('/usuarios'),
    criar: (d: Usuario) => request<void>('/usuarios', { method: 'POST', body: JSON.stringify(d) }),
    atualizar: (id: number, d: Usuario) =>
      request<void>(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    excluir: (id: number) => request<void>(`/usuarios/${id}`, { method: 'DELETE' }),
  },
  questoes: {
    listar: () => request<Questao[]>('/questoes'),
    criar: (d: Questao) =>
      request<{ id: number }>('/questoes', { method: 'POST', body: JSON.stringify(d) }),
    atualizar: (id: number, d: Questao) =>
      request<void>(`/questoes/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    excluir: (id: number) => request<void>(`/questoes/${id}`, { method: 'DELETE' }),
  },
  avaliacoes: {
    listar: () => request<Avaliacao[]>('/avaliacoes'),
    criar: (d: Avaliacao) =>
      request<void>('/avaliacoes', { method: 'POST', body: JSON.stringify(d) }),
    atualizar: (id: number, d: Avaliacao) =>
      request<void>(`/avaliacoes/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    excluir: (id: number) => request<void>(`/avaliacoes/${id}`, { method: 'DELETE' }),
  },
  avaliacoesQuestoes: {
    listarPorAvaliacao: (idAvaliacao: number) =>
      request<AvaliacaoQuestao[]>(`/avaliacoes-questoes/avaliacao/${idAvaliacao}`),
    criar: (d: AvaliacaoQuestao) =>
      request<AvaliacaoQuestao>('/avaliacoes-questoes', {
        method: 'POST',
        body: JSON.stringify(d),
      }),
    atualizar: (idAv: number, idQ: number, d: AvaliacaoQuestao) =>
      request<AvaliacaoQuestao>(`/avaliacoes-questoes/${idAv}/${idQ}`, {
        method: 'PUT',
        body: JSON.stringify(d),
      }),
    excluir: (idAv: number, idQ: number) =>
      request<void>(`/avaliacoes-questoes/${idAv}/${idQ}`, { method: 'DELETE' }),
  },
  atribuicoes: {
    listar: () => request<Atribuicao[]>('/atribuicoes'),
    criar: (d: Atribuicao) =>
      request<void>('/atribuicoes', { method: 'POST', body: JSON.stringify(d) }),
    atualizar: (idU: number, idAv: number, d: Atribuicao) =>
      request<void>(`/atribuicoes/${idU}/${idAv}`, {
        method: 'PUT',
        body: JSON.stringify(d),
      }),
    excluir: (idU: number, idAv: number) =>
      request<void>(`/atribuicoes/${idU}/${idAv}`, { method: 'DELETE' }),
  },
  respostas: {
    listarPorAtribuicao: (idU: number, idAv: number) =>
      request<Resposta[]>(`/respostas/atribuicao/${idU}/${idAv}`),
    criar: (d: Resposta) =>
      request<Resposta>('/respostas', { method: 'POST', body: JSON.stringify(d) }),
    atualizar: (idU: number, idAv: number, idQ: number, d: Resposta) =>
      request<Resposta>(`/respostas/${idU}/${idAv}/${idQ}`, {
        method: 'PUT',
        body: JSON.stringify(d),
      }),
    corrigir: (idU: number, idAv: number, idQ: number, nota: number) =>
      request<Resposta>(`/respostas/${idU}/${idAv}/${idQ}/nota`, {
        method: 'PUT',
        body: JSON.stringify({ nota }),
      }),
    excluir: (idU: number, idAv: number, idQ: number) =>
      request<void>(`/respostas/${idU}/${idAv}/${idQ}`, { method: 'DELETE' }),
  },
  relatorios: {
    alunosMedia: () => request<AlunoMediaGeralDto[]>('/relatorios/alunos-media'),
    questoesDificeis: () => request<QuestaoMaisDificilDto[]>('/relatorios/questoes-dificeis'),
    questoesErros: () => request<QuestaoMaisErrosDto[]>('/relatorios/questoes-erros'),
  },
};