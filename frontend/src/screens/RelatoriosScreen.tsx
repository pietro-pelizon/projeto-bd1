import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { api } from '../api';
import type {
  AlunoMediaGeralDto,
  QuestaoMaisDificilDto,
  QuestaoMaisErrosDto,
} from '../types';
import { Banner, Botao, styles } from '../ui';

function normalizarPercentual(taxa: number | null, erros: number, total: number): number {
  const val = Number(taxa ?? 0);
  if (val <= 1 && erros > 0 && erros / Math.max(1, total) > 0.02) {
    return Math.min(100, Math.max(0, val * 100));
  }
  return Math.min(100, Math.max(0, val));
}

export default function RelatoriosScreen() {
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

  return (
    <View>
      <Banner erro={erro} sucesso={null} onClose={() => setErro(null)} />

      <View style={[styles.rowBetween, { marginBottom: 14 }]}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>
          Dashboard de Relatórios SQL
        </Text>
        <Botao titulo="Atualizar Dados" onPress={carregar} />
      </View>

      {loading && <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }} />}

      {/* Relatório 1: Média Geral por Aluno */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>1. Média Geral por Aluno</Text>
        <Text style={styles.subtitulo}>GET /relatorios/alunos-media</Text>
        {alunos.length === 0 ? (
          <Text style={styles.itemMeta}>Nenhum dado encontrado.</Text>
        ) : (
          alunos.map((a, idx) => {
            const media = Number(a.mediaGeral ?? 0);
            const pct = Math.min(100, Math.max(0, (media / 10) * 100));
            return (
              <View key={`${a.email}-${idx}`} style={styles.itemBox}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.itemTitulo}>
                      #{idx + 1} {a.nome}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {a.email} • {a.avaliacoesConcluidas} avaliação(ões) concluída(s)
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTexto}>Média: {media.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraPreenchimento,
                      { width: `${pct}%`, backgroundColor: '#2563EB' },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Relatório 2: Questões Mais Difíceis */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>2. Questões Mais Difíceis (Menor Média de Nota)</Text>
        <Text style={styles.subtitulo}>GET /relatorios/questoes-dificeis</Text>
        {dificeis.length === 0 ? (
          <Text style={styles.itemMeta}>Nenhum dado encontrado.</Text>
        ) : (
          dificeis.map((q) => {
            const media = Number(q.mediaNota ?? 0);
            const pct = Math.min(100, Math.max(0, (media / 10) * 100));
            return (
              <View key={q.idQuestao} style={styles.itemBox}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.itemTitulo, { flex: 1 }]}>
                    [Q#{q.idQuestao}] {q.enunciado}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.badgeTexto, { color: '#92400E' }]}>
                      Média: {media.toFixed(2)} ({q.totalRespostas} resp.)
                    </Text>
                  </View>
                </View>
                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraPreenchimento,
                      { width: `${pct}%`, backgroundColor: '#D97706' },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Relatório 3: Questões com Mais Erros */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>3. Questões com Maior Taxa de Erros</Text>
        <Text style={styles.subtitulo}>GET /relatorios/questoes-erros</Text>
        {erros.length === 0 ? (
          <Text style={styles.itemMeta}>Nenhum dado encontrado.</Text>
        ) : (
          erros.map((q) => {
            const pct = normalizarPercentual(q.taxa_erros, q.quantidadeErros, q.totalRespotas);
            return (
              <View key={q.idQuestao} style={styles.itemBox}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.itemTitulo, { flex: 1 }]}>
                    [Q#{q.idQuestao}] {q.enunciado}
                  </Text>
                  <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.badgeTexto, { color: '#991B1B' }]}>
                      {q.quantidadeErros}/{q.totalRespotas} erros ({pct.toFixed(1)}%)
                    </Text>
                  </View>
                </View>
                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraPreenchimento,
                      { width: `${pct}%`, backgroundColor: '#DC2626' },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}