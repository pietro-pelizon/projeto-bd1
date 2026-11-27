import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { api } from '../api';
import type { Avaliacao, AvaliacaoQuestao, Questao } from '../types';
import { Banner, Botao, Chip, confirmarAcao, styles } from '../ui';

const VAZIO: Avaliacao = {
  titulo: '',
  descricao: '',
  data: '2026-11-26',
  hora_inicio: '08:00:00',
  hora_fim: '10:00:00',
};

export default function AvaliacoesScreen() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [form, setForm] = useState<Avaliacao>(VAZIO);
  const [editId, setEditId] = useState<number | null>(null);

  const [avSelecionada, setAvSelecionada] = useState<Avaliacao | null>(null);
  const [vinculos, setVinculos] = useState<AvaliacaoQuestao[]>([]);
  const [questaoId, setQuestaoId] = useState<number | null>(null);
  const [valorQuestao, setValorQuestao] = useState('2.5');

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const carregar = async () => {
    try {
      const [avs, qs] = await Promise.all([api.avaliacoes.listar(), api.questoes.listar()]);
      setAvaliacoes(avs);
      setQuestoes(qs);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const carregarVinculos = async (idAv: number) => {
    try {
      setVinculos(await api.avaliacoesQuestoes.listarPorAvaliacao(idAv));
    } catch (e: any) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const salvarAvaliacao = async () => {
    setErro(null);
    setSucesso(null);
    try {
      if (editId !== null) {
        await api.avaliacoes.atualizar(editId, form);
        setSucesso('Avaliação atualizada!');
      } else {
        await api.avaliacoes.criar(form);
        setSucesso('Avaliação criada!');
      }
      setForm(VAZIO);
      setEditId(null);
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const excluirAvaliacao = (id: number) => {
    confirmarAcao(`Excluir avaliação #${id}?`, async () => {
      try {
        await api.avaliacoes.excluir(id);
        if (avSelecionada?.id === id) setAvSelecionada(null);
        setSucesso('Avaliação excluída.');
        carregar();
      } catch (e: any) {
        setErro(e.message);
      }
    });
  };

  const adicionarQuestaoNaProva = async () => {
    if (!avSelecionada?.id || !questaoId) {
      setErro('Selecione uma questão primeiro.');
      return;
    }
    setErro(null);
    try {
      await api.avaliacoesQuestoes.criar({
        id_avaliacao: avSelecionada.id,
        id_questao: questaoId,
        valor: Number(valorQuestao.replace(',', '.')),
      });
      setSucesso('Questão vinculada à avaliação!');
      carregarVinculos(avSelecionada.id);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const removerVinculo = (idAv: number, idQ: number) => {
    confirmarAcao(`Remover questão #${idQ} desta prova?`, async () => {
      try {
        await api.avaliacoesQuestoes.excluir(idAv, idQ);
        setSucesso('Questão removida da avaliação.');
        carregarVinculos(idAv);
      } catch (e: any) {
        setErro(e.message);
      }
    });
  };

  const somaValores = vinculos.reduce((acc, v) => acc + Number(v.valor), 0);
  const restante = Math.max(0, 10 - somaValores);
  const fmt = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

  return (
    <View>
      <Banner erro={erro} sucesso={sucesso} onClose={() => { setErro(null); setSucesso(null); }} />

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          {editId !== null ? `Editar Avaliação #${editId}` : 'Nova Avaliação'}
        </Text>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={form.titulo}
          onChangeText={(titulo) => setForm({ ...form, titulo })}
          placeholder="Ex: Prova 1 - Banco de Dados"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={form.descricao || ''}
          onChangeText={(descricao) => setForm({ ...form, descricao })}
          placeholder="Conteúdo da prova (opcional)"
        />

        <View style={styles.row}>
          <View style={{ flex: 1, minWidth: 140 }}>
            <Text style={styles.label}>Data (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={form.data}
              onChangeText={(data) => setForm({ ...form, data })}
            />
          </View>
          <View style={{ flex: 1, minWidth: 120 }}>
            <Text style={styles.label}>Início (HH:mm:ss)</Text>
            <TextInput
              style={styles.input}
              value={form.hora_inicio}
              onChangeText={(hora_inicio) => setForm({ ...form, hora_inicio })}
            />
          </View>
          <View style={{ flex: 1, minWidth: 120 }}>
            <Text style={styles.label}>Fim (HH:mm:ss)</Text>
            <TextInput
              style={styles.input}
              value={form.hora_fim}
              onChangeText={(hora_fim) => setForm({ ...form, hora_fim })}
            />
          </View>
        </View>

        <View style={[styles.row, { marginTop: 12 }]}>
          <Botao titulo={editId !== null ? 'Salvar Alterações' : 'Criar Avaliação'} onPress={salvarAvaliacao} />
          {editId !== null && (
            <Botao
              titulo="Cancelar"
              variante="secundario"
              onPress={() => {
                setEditId(null);
                setForm(VAZIO);
              }}
            />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Avaliações ({avaliacoes.length})</Text>
        {avaliacoes.map((a) => (
          <View key={a.id} style={styles.itemBox}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>
                  #{a.id} — {a.titulo}
                </Text>
                <Text style={styles.itemMeta}>
                  {a.data} | {a.hora_inicio} até {a.hora_fim}
                </Text>
                {!!a.descricao && <Text style={styles.itemMeta}>{a.descricao}</Text>}
              </View>
              <View style={styles.row}>
                <Botao
                  titulo="Questões da Prova"
                  variante="sucesso"
                  pequeno
                  onPress={() => {
                    setAvSelecionada(a);
                    if (a.id) carregarVinculos(a.id);
                  }}
                />
                <Botao
                  titulo="Editar"
                  variante="secundario"
                  pequeno
                  onPress={() => {
                    setEditId(a.id ?? null);
                    setForm(a);
                  }}
                />
                {a.id !== undefined && (
                  <Botao titulo="Excluir" variante="perigo" pequeno onPress={() => excluirAvaliacao(a.id!)} />
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {avSelecionada && (
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>
            Questões da Avaliação #{avSelecionada.id}: {avSelecionada.titulo}
          </Text>

          <View style={[styles.rowBetween, { marginBottom: 6 }]}>
            <Text style={styles.itemMeta}>Soma dos valores: {fmt(somaValores)} / 10</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: restante === 0 ? '#DCFCE7' : '#E0F2FE' },
              ]}
            >
              <Text style={[styles.badgeTexto, { color: restante === 0 ? '#166534' : '#0369A1' }]}>
                {restante === 0 ? 'Prova fechada em 10' : `Disponível: ${fmt(restante)}`}
              </Text>
            </View>
          </View>
          <View style={styles.barraFundo}>
            <View
              style={[
                styles.barraPreenchimento,
                {
                  width: `${Math.min(100, (somaValores / 10) * 100)}%`,
                  backgroundColor: somaValores > 10 ? '#DC2626' : '#2563EB',
                },
              ]}
            />
          </View>

          <Text style={styles.label}>Escolha uma questão para vincular:</Text>
          <View style={[styles.row, { marginBottom: 8 }]}>
            {questoes.map((q) => (
              <Chip
                key={q.id}
                label={`Q#${q.id} (${q.enunciado.slice(0, 22)}...)`}
                ativo={questaoId === q.id}
                onPress={() => setQuestaoId(q.id ?? null)}
              />
            ))}
          </View>

          <View style={[styles.row, { marginBottom: 12 }]}>
            <TextInput
              style={[styles.input, { width: 120 }]}
              value={valorQuestao}
              onChangeText={setValorQuestao}
              placeholder={`Valor (máx ${fmt(restante)})`}
            />
            <Botao titulo="Adicionar à Prova" onPress={adicionarQuestaoNaProva} />
          </View>

          {vinculos.map((v) => {
            const q = questoes.find((item) => item.id === v.id_questao);
            return (
              <View key={`${v.id_avaliacao}-${v.id_questao}`} style={styles.itemBox}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitulo}>
                      Questão #{v.id_questao} — Valor: {v.valor}
                    </Text>
                    {q && <Text style={styles.itemMeta}>{q.enunciado}</Text>}
                  </View>
                  <Botao
                    titulo="Remover"
                    variante="perigo"
                    pequeno
                    onPress={() => removerVinculo(v.id_avaliacao, v.id_questao)}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
