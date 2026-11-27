import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { api } from '../api';
import { BarrasHorizontais, Colunas } from '../charts';
import type {
  AlunoMediaGeralDto,
  QuestaoMaisDificilDto,
  QuestaoMaisErrosDto,
} from '../types';
import { Banner, Botao, Chip, styles } from '../ui';

type Aba = 'alunos' | 'dificeis' | 'erros';

const num = (x: unknown) => Number(x ?? 0);
const fmt2 = (n: number) => n.toFixed(2).replace('.', ',');

// Taxa de erro em % calculada a partir das contagens (não depende do formato que o SQL devolve).
function percentualErros(q: QuestaoMaisErrosDto): number {
  const total = num(q.totalRespotas);
  return total > 0 ? (num(q.quantidadeErros) / total) * 100 : 0;
}

function Cabecalho({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.cardTitulo}>{titulo}</Text>
      <Text style={styles.subtitulo}>{descricao}</Text>
    </View>
  );
}

export default function RelatoriosScreen() {
  const [aba, setAba] = useState<Aba>('alunos');
  const [alunos, setAlunos] = useState<AlunoMediaGeralDto[]>([]);
  const [dificeis, setDificeis] = useState<QuestaoMaisDificilDto[]>([]);
  const [erros, setErros] = useState<QuestaoMaisErrosDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const [a, d, e] = await Promise.all([
        api.relatorios.alunosMedia(),
        api.relatorios.questoesDificeis(),
        api.relatorios.questoesErros(),
      ]);
      setAlunos(a);
      setDificeis(d);
      setErros(e);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const vazio = <Text style={styles.itemMeta}>Nenhum dado encontrado.</Text>;

  return (
    <View>
      <Banner erro={erro} sucesso={null} onClose={() => setErro(null)} />

      <View style={[styles.rowBetween, { marginBottom: 14 }]}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Relatórios</Text>
        <Botao titulo="Atualizar dados" onPress={carregar} />
      </View>

      <View style={[styles.row, { marginBottom: 14 }]}>
        <Chip label="Média por aluno" ativo={aba === 'alunos'} onPress={() => setAba('alunos')} />
        <Chip label="Questões mais difíceis" ativo={aba === 'dificeis'} onPress={() => setAba('dificeis')} />
        <Chip label="Questões com mais erros" ativo={aba === 'erros'} onPress={() => setAba('erros')} />
      </View>

      {loading && <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }} />}

      {/* ---------------------------------------------------------- 1. média por aluno */}
      {aba === 'alunos' && (
        <>
          <View style={styles.card}>
            <Cabecalho
              titulo="Média geral por aluno"
              descricao="Média das notas totais das avaliações concluídas (escala de 0 a 10)."
            />
            {alunos.length === 0 ? (
              vazio
            ) : (
              <BarrasHorizontais
                itens={alunos.map((a) => ({
                  rotulo: a.nome,
                  valor: num(a.mediaGeral),
                  detalhe: `${a.avaliacoesConcluidas} aval.`,
                }))}
                max={10}
                cor="#2563EB"
              />
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Tabela</Text>
            {alunos.map((a, i) => (
              <View key={`${a.email}-${i}`} style={styles.itemBox}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitulo}>
                      #{i + 1} {a.nome}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {a.email} • {a.avaliacoesConcluidas} avaliação(ões) concluída(s)
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTexto}>Média: {fmt2(num(a.mediaGeral))}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ---------------------------------------------------------- 2. questões difíceis */}
      {aba === 'dificeis' && (
        <>
          <View style={styles.card}>
            <Cabecalho
              titulo="Questões mais difíceis"
              descricao="Menor média de nota obtida pelos alunos em cada questão (escala de 0 a 10)."
            />
            {dificeis.length === 0 ? (
              vazio
            ) : (
              <Colunas
                itens={dificeis.map((q) => ({ rotulo: `Q${q.idQuestao}`, valor: num(q.mediaNota) }))}
                max={10}
                cor="#D97706"
              />
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Tabela</Text>
            {dificeis.map((q) => (
              <View key={q.idQuestao} style={styles.itemBox}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.itemTitulo, { flex: 1 }]}>
                    [Q{q.idQuestao}] {q.enunciado}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.badgeTexto, { color: '#92400E' }]}>
                      Média: {fmt2(num(q.mediaNota))} ({q.totalRespostas} resp.)
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ---------------------------------------------------------- 3. questões com mais erros */}
      {aba === 'erros' && (
        <>
          <View style={styles.card}>
            <Cabecalho
              titulo="Questões com maior taxa de erros"
              descricao="Percentual de respostas erradas em relação ao total de respostas da questão."
            />
            {erros.length === 0 ? (
              vazio
            ) : (
              <Colunas
                itens={erros.map((q) => ({ rotulo: `Q${q.idQuestao}`, valor: percentualErros(q) }))}
                max={100}
                cor="#DC2626"
                unidade="%"
                casas={0}
              />
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Tabela</Text>
            {erros.map((q) => (
              <View key={q.idQuestao} style={styles.itemBox}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.itemTitulo, { flex: 1 }]}>
                    [Q{q.idQuestao}] {q.enunciado}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.badgeTexto, { color: '#991B1B' }]}>
                      {q.quantidadeErros}/{q.totalRespotas} erros ({percentualErros(q).toFixed(1).replace('.', ',')}%)
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
