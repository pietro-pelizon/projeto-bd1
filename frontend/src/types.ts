export type TipoQuestao = 'MULTIPLA_ESCOLHA' | 'DISCURSIVA';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  tipo: string;
}

// Resposta do POST /usuarios/login (nunca traz a senha)
export interface UsuarioSessao {
  id: number;
  nome: string;
  email: string;
  tipo: 'ALUNO' | 'PROFESSOR' | string;
}

export interface Alternativa {
  idQuestao?: number;
  letra: string;
  correta: boolean;
  texto: string;
}

export interface Questao {
  id?: number;
  enunciado: string;
  tipo: TipoQuestao;
  alternativas: Alternativa[];
}

export interface Avaliacao {
  id?: number;
  titulo: string;
  descricao?: string;
  data: string;        // YYYY-MM-DD
  hora_inicio: string; // HH:mm:ss
  hora_fim: string;    // HH:mm:ss
}

export interface AvaliacaoQuestao {
  id_avaliacao: number;
  id_questao: number;
  valor: number;
}

export interface Atribuicao {
  id_usuario: number;
  id_avaliacao: number;
  status: string;
}

export interface Resposta {
  id_usuario: number;
  id_avaliacao: number;
  id_questao: number;
  texto_resposta?: string | null;
  letra_marcada?: string | null;
  nota?: number | null;
}

export interface AlunoMediaGeralDto {
  nome: string;
  email: string;
  mediaGeral: number | null;
  avaliacoesConcluidas: number;
}

export interface QuestaoMaisDificilDto {
  idQuestao: number;
  enunciado: string;
  mediaNota: number | null;
  totalRespostas: number;
}

export interface QuestaoMaisErrosDto {
  idQuestao: number;
  enunciado: string;
  quantidadeErros: number;
  totalRespotas: number;
  taxa_erros: number | null;
}
