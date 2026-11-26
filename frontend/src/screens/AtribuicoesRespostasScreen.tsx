import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { api } from '../api';
import type { Atribuicao, Avaliacao, Questao, Resposta, Usuario } from '../types';
import { Banner, Botao, Chip, confirmarAcao, styles } from '../ui';

const STATUS_OPCOES = ['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO'];

export default function AtribuicoesRespostasScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [atribuicoes, setAtribuicoes] = useState<Atribuicao[]>([]);

  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [idAvaliacao, setIdAvaliacao] = useState<number | null>(null);
  const [status, setStatus] = useState('NAO_INICIADO');

  const [selecionada, setSelecionada] = useState<Atribuicao | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [idQuestaoResp, setIdQuestaoResp] = useState<number | null>(null);
  const [letraMarcada, setLetraMarcada] = useState('');
  const [textoResposta, setTextoResposta] = useState('');
  const [nota, setNota] = useState('');
  const [editandoResp, setEditandoResp] = useState(false);

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const carregar = async () => {
    try {
      const [u, av, q, at] = await Promise.all([
        api.usuarios.listar(),
        api.avaliacoes.listar(),
        api.questoes.listar(),
        api.atribuicoes.listar(),
      ]);
      setUsuarios(u);
      setAvaliacoes(av);
      setQuestoes(q);
      setAtribuicoes(at);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const carregarRespostas = async (idU: number, idAv: number) => {
    try {
      setRespostas(await api.respostas.listarPorAtribuicao(idU, idAv));
    } catch (e: any) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const criarAtribuicao = async () => {
    if (!idUsuario || !idAvaliacao) {
      setErro('Selecione um usuário e uma avaliação.');
      return;
    }
    setErro(null);
    try {
      await api.atribuicoes.criar({ id_usuario: idUsuario, id_avaliacao: idAvaliacao, status });
      setSucesso('Atribuição criada!');
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const mudarStatus = async (at: Atribuicao, novoStatus: string) => {
    setErro(null);
    try {
      await api.atribuicoes.atualizar(at.id_usuario, at.id_avaliacao, { ...at, status: novoStatus });
      setSucesso(`Status atualizado para ${novoStatus}.`);
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const excluirAtribuicao = (at: Atribuicao) => {
    confirmarAcao(`Excluir atribuição Usuário #${at.id_usuario} / Prova #${at.id_avaliacao}?`, async () => {
      try {
        await api.atribuicoes.excluir(at.id_usuario, at.id_avaliacao);
        if (
          selecionada?.id_usuario === at.id_usuario &&
          selecionada?.id_avaliacao === at.id_avaliacao
        ) {
          setSelecionada(null);
        }
        setSucesso('Atribuição excluída.');
        carregar();
      } catch (e: any) {
        setErro(e.message);
      }
    });
  };

  const salvarResposta = async () => {
    if (!selecionada || !idQuestaoResp) {
      setErro('Selecione uma questão para registrar a resposta.');
      return;
    }
    setErro(null);
    const payload: Resposta = {
      id_usuario: selecionada.id_usuario,
      id_avaliacao: selecionada.id_avaliacao,
      id_questao: idQuestaoResp,
      letra_marcada: letraMarcada.trim() ? letraMarcada.trim().toUpperCase() : null,
      texto_resposta: textoResposta.trim() ? textoResposta.trim() : null,
      nota: nota.trim() ? Number(nota.replace(',', '.')) : null,
    };

    try {
      if (editandoResp) {
        await api.respostas.atualizar(
          selecionada.id_usuario,
          selecionada.id_avaliacao,
          idQuestaoResp,
          payload
        );
        setSucesso('Resposta atualizada/corrigida!');
      } else {
        await api.respostas.criar(payload);
        setSucesso('Resposta registrada!');
      }
      setLetraMarcada('');
      setTextoResposta('');
      setNota('');
      setEditandoResp(false);
      carregarRespostas(selecionada.id_usuario, selecionada.id_avaliacao);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const excluirResposta = (r: Resposta) => {
    confirmarAcao(`Excluir resposta da questão #${r.id_questao}?`, async () => {
      try {
        await api.respostas.excluir(r.id_usuario, r.id_avaliacao, r.id_questao);
        setSucesso('Resposta excluída.');
        carregarRespostas(r.id_usuario, r.id_avaliacao);
      } catch (e: any) {
        setErro(e.message);
      }
    });
  };

  const nomeUsuario = (id: number) => usuarios.find((u) => u.id === id)?.nome || `Usuário #${id}`;
  const tituloAvaliacao = (id: number) =>
    avaliacoes.find((a) => a.id === id)?.titulo || `Avaliação #${id}`;

  return (
    <View>
      <Banner erro={erro} sucesso={sucesso} onClose={() => { setErro(null); setSucesso(null); }} />

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Nova Atribuição (Aluno → Avaliação)</Text>

        <Text style={styles.label}>Usuário</Text>
        <View style={styles.row}>
          {usuarios.map((u) => (
            <Chip
              key={u.id}
              label={`#${u.id} ${u.nome}`}
              ativo={idUsuario === u.id}
              onPress={() => setIdUsuario(u.id ?? null)}
            />
          ))}
        </View>

        <Text style={styles.label}>Avaliação</Text>
        <View style={styles.row}>
          {avaliacoes.map((a) => (
            <Chip
              key={a.id}
              label={`#${a.id} ${a.titulo}`}
              ativo={idAvaliacao === a.id}
              onPress={() => setIdAvaliacao(a.id ?? null)}
            />
          ))}
        </View>

        <Text style={styles.label}>Status Inicial</Text>
        <View style={[styles.row, { marginBottom: 12 }]}>
          {STATUS_OPCOES.map((s) => (
            <Chip key={s} label={s} ativo={status === s} onPress={() => setStatus(s)} />
          ))}
        </View>

        <Botao titulo="Atribuir Avaliação" onPress={criarAtribuicao} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Atribuições ({atribuicoes.length})</Text>
        {atribuicoes.map((at) => (
          <View key={`${at.id_usuario}-${at.id_avaliacao}`} style={styles.itemBox}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>
                  {nomeUsuario(at.id_usuario)} → {tituloAvaliacao(at.id_avaliacao)}
                </Text>
                <Text style={styles.itemMeta}>Status atual: {at.status}</Text>
              </View>
              <View style={styles.row}>
                <Botao
                  titulo="Respostas / Nota"
                  variante="sucesso"
                  pequeno
                  onPress={() => {
                    setSelecionada(at);
                    carregarRespostas(at.id_usuario, at.id_avaliacao);
                  }}
                />
                <Botao titulo="Excluir" variante="perigo" pequeno onPress={() => excluirAtribuicao(at)} />
              </View>
            </View>
            <View style={[styles.row, { marginTop: 8 }]}>
              {STATUS_OPCOES.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  ativo={at.status === s}
                  onPress={() => mudarStatus(at, s)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {selecionada && (
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>
            Respostas: {nomeUsuario(selecionada.id_usuario)} —{' '}
            {tituloAvaliacao(selecionada.id_avaliacao)}
          </Text>

          <Text style={styles.label}>Selecione a Questão</Text>
          <View style={styles.row}>
            {questoes.map((q) => (
              <Chip
                key={q.id}
                label={`Q#${q.id} (${q.tipo === 'DISCURSIVA' ? 'Disc.' : 'M.E.'})`}
                ativo={idQuestaoResp === q.id}
                onPress={() => {
                  setIdQuestaoResp(q.id ?? null);
                  setEditandoResp(false);
                }}
              />
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ width: 130 }}>
              <Text style={styles.label}>Letra (A–G)</Text>
              <TextInput
                style={styles.input}
                value={letraMarcada}
                onChangeText={setLetraMarcada}
                placeholder="Ex: A"
              />
            </View>
            <View style={{ width: 130 }}>
              <Text style={styles.label}>Nota (0 a 10)</Text>
              <TextInput
                style={styles.input}
                value={nota}
                onChangeText={setNota}
                placeholder="Ex: 8.5"
              />
            </View>
          </View>

          <Text style={styles.label}>Texto da Resposta (para discursivas)</Text>
          <TextInput
            style={[styles.input, { minHeight: 60, marginBottom: 10 }]}
            multiline
            value={textoResposta}
            onChangeText={setTextoResposta}
            placeholder="Digite a resposta discursiva..."
          />

          <View style={[styles.row, { marginBottom: 14 }]}>
            <Botao
              titulo={editandoResp ? 'Atualizar Resposta / Nota' : 'Salvar Resposta'}
              onPress={salvarResposta}
            />
            {editandoResp && (
              <Botao
                titulo="Cancelar Edição"
                variante="secundario"
                onPress={() => {
                  setEditandoResp(false);
                  setLetraMarcada('');
                  setTextoResposta('');
                  setNota('');
                }}
              />
            )}
          </View>

          {respostas.map((r) => (
            <View key={r.id_questao} style={styles.itemBox}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitulo}>Questão #{r.id_questao}</Text>
                  {!!r.letra_marcada && <Text style={styles.itemMeta}>Letra: {r.letra_marcada}</Text>}
                  {!!r.texto_resposta && (
                    <Text style={styles.itemMeta}>Texto: {r.texto_resposta}</Text>
                  )}
                  <Text style={styles.itemMeta}>
                    Nota: {r.nota !== null && r.nota !== undefined ? r.nota : 'Sem nota'}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Botao
                    titulo="Corrigir / Editar"
                    variante="secundario"
                    pequeno
                    onPress={() => {
                      setIdQuestaoResp(r.id_questao);
                      setLetraMarcada(r.letra_marcada || '');
                      setTextoResposta(r.texto_resposta || '');
                      setNota(r.nota !== null && r.nota !== undefined ? String(r.nota) : '');
                      setEditandoResp(true);
                    }}
                  />
                  <Botao titulo="Excluir" variante="perigo" pequeno onPress={() => excluirResposta(r)} />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}