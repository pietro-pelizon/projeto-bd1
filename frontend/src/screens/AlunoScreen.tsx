import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../api';
import { useAuth } from '../auth';
import type { Atribuicao, Avaliacao, AvaliacaoQuestao, Questao, Resposta } from '../types';
import { Banner, Botao, confirmarAcao, styles } from '../ui';

const num = (x: unknown) => Number(x ?? 0);
const fmt = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

const STATUS_ROTULO: Record<string, string> = {
  NAO_INICIADO: 'Não iniciada',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluída',
};
const STATUS_COR: Record<string, { fundo: string; texto: string }> = {
  NAO_INICIADO: { fundo: '#E2E8F0', texto: '#334155' },
  EM_ANDAMENTO: { fundo: '#FEF3C7', texto: '#92400E' },
  CONCLUIDO: { fundo: '#DCFCE7', texto: '#166534' },
};

function formatarData(iso: string) {
  const [a, m, d] = (iso || '').split('-');
  return a && m && d ? `${d}/${m}/${a}` : iso;
}
const hhmm = (h: string) => (h || '').slice(0, 5);

export default function AlunoScreen() {
  const { usuario } = useAuth();
  const idUsuario = usuario?.id;

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [minhas, setMinhas] = useState<Atribuicao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [aberta, setAberta] = useState<Atribuicao | null>(null);
  const [vinculos, setVinculos] = useState<AvaliacaoQuestao[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [marcadas, setMarcadas] = useState<Record<number, string>>({});
  const [textos, setTextos] = useState<Record<number, string>>({});
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const carregarLista = async () => {
    if (idUsuario == null) return;
    try {
      const [av, q, at] = await Promise.all([
        api.avaliacoes.listar(),
        api.questoes.listar(),
        api.atribuicoes.listar(),
      ]);
      setAvaliacoes(av);
      setQuestoes(q);
      // O aluno só enxerga as atribuições dele.
      setMinhas(at.filter((a) => a.id_usuario === idUsuario));
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarLista();
  }, [idUsuario]);

  const carregarDetalhe = async (at: Atribuicao) => {
    const [vs, rs] = await Promise.all([
      api.avaliacoesQuestoes.listarPorAvaliacao(at.id_avaliacao),
      api.respostas.listarPorAtribuicao(at.id_usuario, at.id_avaliacao),
    ]);
    setVinculos(vs);
    setRespostas(rs);
    const m: Record<number, string> = {};
    const t: Record<number, string> = {};
    rs.forEach((r) => {
      if (r.letra_marcada) m[r.id_questao] = r.letra_marcada;
      if (r.texto_resposta) t[r.id_questao] = r.texto_resposta;
    });
    setMarcadas(m);
    setTextos(t);
  };

  const abrir = async (at: Atribuicao) => {
    setErro(null);
    setSucesso(null);
    try {
      await carregarDetalhe(at);
      setAberta(at);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const voltar = () => {
    setAberta(null);
    setErro(null);
    setSucesso(null);
    carregarLista();
  };

  const tituloDe = (id: number) => avaliacoes.find((a) => a.id === id)?.titulo || `Avaliação #${id}`;

  // dados da avaliação aberta
  const itens = vinculos
    .map((v) => ({ questao: questoes.find((q) => q.id === v.id_questao), valor: num(v.valor) }))
    .filter((i): i is { questao: Questao; valor: number } => !!i.questao);

  const concluida = aberta?.status === 'CONCLUIDO';

  const salvar = async (concluir: boolean) => {
    if (!aberta) return;
    setErro(null);
    setSucesso(null);

    const faltando: string[] = [];
    const paraEnviar: { idQuestao: number; payload: Resposta }[] = [];

    itens.forEach(({ questao }, idx) => {
      const id = questao.id!;
      const discursiva = questao.tipo === 'DISCURSIVA';
      const letra = (marcadas[id] || '').trim();
      const texto = (textos[id] || '').trim();
      const preenchida = discursiva ? texto !== '' : letra !== '';

      if (!preenchida) {
        faltando.push(`${idx + 1}`);
        return;
      }
      paraEnviar.push({
        idQuestao: id,
        payload: {
          id_usuario: aberta.id_usuario,
          id_avaliacao: aberta.id_avaliacao,
          id_questao: id,
          letra_marcada: discursiva ? null : letra,
          texto_resposta: discursiva ? texto : null,
        },
      });
    });

    if (concluir && faltando.length > 0) {
      setErro(`Responda todas as questões antes de concluir. Faltam: ${faltando.join(', ')}.`);
      return;
    }
    if (paraEnviar.length === 0) {
      setErro('Responda pelo menos uma questão para salvar.');
      return;
    }

    const executar = async () => {
      setSalvando(true);
      try {
        for (const { idQuestao, payload } of paraEnviar) {
          const jaExiste = respostas.some((r) => r.id_questao === idQuestao);
          if (jaExiste) {
            await api.respostas.atualizar(aberta.id_usuario, aberta.id_avaliacao, idQuestao, payload);
          } else {
            await api.respostas.criar(payload);
          }
        }
        let atual = aberta;
        if (concluir) {
          await api.atribuicoes.atualizar(aberta.id_usuario, aberta.id_avaliacao, {
            id_usuario: aberta.id_usuario,
            id_avaliacao: aberta.id_avaliacao,
            status: 'CONCLUIDO',
          });
          atual = { ...aberta, status: 'CONCLUIDO' };
        } else if (aberta.status === 'NAO_INICIADO') {
          atual = { ...aberta, status: 'EM_ANDAMENTO' }; // o backend já marcou ao criar a resposta
        }
        await carregarDetalhe(atual);
        setAberta(atual);
        setSucesso(concluir ? 'Avaliação enviada! Veja o seu resultado abaixo.' : 'Respostas salvas.');
      } catch (e: any) {
        setErro(e.message);
      } finally {
        setSalvando(false);
      }
    };

    if (concluir) {
      confirmarAcao('Concluir e enviar a avaliação? Depois disso você não poderá alterar as respostas.', executar);
    } else {
      executar();
    }
  };

  //  tela de uma avaliação
  if (aberta) {
    const av = avaliacoes.find((a) => a.id === aberta.id_avaliacao);
    const totalPossivel = itens.reduce((acc, i) => acc + i.valor, 0);
    const notaTotal = respostas.reduce((acc, r) => acc + (r.nota != null ? num(r.nota) : 0), 0);
    const aguardando = respostas.filter((r) => r.nota == null).length;
    const cor = STATUS_COR[aberta.status] ?? STATUS_COR.NAO_INICIADO;

    return (
      <View>
        <Banner erro={erro} sucesso={sucesso} onClose={() => { setErro(null); setSucesso(null); }} />

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>
                {tituloDe(aberta.id_avaliacao)}
              </Text>
              {!!av?.descricao && <Text style={styles.itemMeta}>{av.descricao}</Text>}
              {av && (
                <Text style={styles.itemMeta}>
                  {formatarData(av.data)} • {hhmm(av.hora_inicio)} às {hhmm(av.hora_fim)}
                </Text>
              )}
            </View>
            <View style={[styles.badge, { backgroundColor: cor.fundo }]}>
              <Text style={[styles.badgeTexto, { color: cor.texto }]}>
                {STATUS_ROTULO[aberta.status] ?? aberta.status}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Botao titulo="← Voltar às minhas avaliações" variante="secundario" pequeno onPress={voltar} />
          </View>
        </View>

        {concluida && (
          <View style={[styles.card, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
            <Text style={styles.cardTitulo}>Seu resultado</Text>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#0369A1' }}>
              {fmt(notaTotal)} <Text style={{ fontSize: 18, color: '#64748B' }}>/ {fmt(totalPossivel)}</Text>
            </Text>
            {aguardando > 0 && (
              <Text style={[styles.itemMeta, { marginTop: 6 }]}>
                {aguardando} questão(ões) discursiva(s) ainda aguardando correção do professor. A nota
                total pode aumentar.
              </Text>
            )}
          </View>
        )}

        {itens.map(({ questao, valor }, idx) => {
          const id = questao.id!;
          const discursiva = questao.tipo === 'DISCURSIVA';
          const resp = respostas.find((r) => r.id_questao === id);
          return (
            <View key={id} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={[styles.itemTitulo, { flex: 1 }]}>Questão {idx + 1}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>Vale {fmt(valor)}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 15, color: '#0F172A', marginVertical: 10 }}>{questao.enunciado}</Text>

              {discursiva ? (
                <TextInput
                  style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
                  multiline
                  editable={!concluida}
                  value={textos[id] || ''}
                  onChangeText={(t) => setTextos({ ...textos, [id]: t })}
                  placeholder="Digite a sua resposta..."
                  maxLength={3000}
                />
              ) : (
                questao.alternativas.map((alt) => {
                  const marcada = marcadas[id] === alt.letra;
                  return (
                    <TouchableOpacity
                      key={alt.letra}
                      disabled={concluida}
                      onPress={() => setMarcadas({ ...marcadas, [id]: alt.letra })}
                      style={[local.alternativa, marcada && local.alternativaMarcada]}
                    >
                      <View style={[local.radio, marcada && local.radioMarcado]}>
                        {marcada && <View style={local.radioMiolo} />}
                      </View>
                      <Text style={{ flex: 1, fontSize: 14, color: '#0F172A' }}>
                        <Text style={{ fontWeight: '700' }}>{alt.letra})</Text> {alt.texto}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}

              {concluida && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: '700', color: '#334155' }}>
                    {resp?.nota == null
                      ? resp
                        ? 'Nota: aguardando correção'
                        : 'Não respondida (nota 0)'
                      : `Nota: ${fmt(num(resp.nota))} de ${fmt(valor)}`}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {!concluida && (
          <View style={styles.card}>
            {salvando ? (
              <ActivityIndicator color="#2563EB" />
            ) : (
              <View style={styles.row}>
                <Botao titulo="Salvar respostas" variante="secundario" onPress={() => salvar(false)} />
                <Botao titulo="Concluir e enviar" variante="sucesso" onPress={() => salvar(true)} />
              </View>
            )}
            <Text style={[styles.subtitulo, { marginTop: 10, marginBottom: 0 }]}>
              Você pode salvar e continuar depois. Ao concluir, as respostas não podem mais ser alteradas.
            </Text>
          </View>
        )}
      </View>
    );
  }

  // lista das minhas avaliações
  return (
    <View>
      <Banner erro={erro} sucesso={sucesso} onClose={() => { setErro(null); setSucesso(null); }} />

      <Text style={{ fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 4 }}>
        Minhas avaliações
      </Text>
      <Text style={[styles.subtitulo, { marginBottom: 14 }]}>
        Avaliações atribuídas a você.
      </Text>

      {carregando && <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }} />}

      {!carregando && minhas.length === 0 && (
        <View style={styles.card}>
          <Text style={styles.itemMeta}>Nenhuma avaliação foi atribuída a você ainda.</Text>
        </View>
      )}

      {minhas.map((at) => {
        const av = avaliacoes.find((a) => a.id === at.id_avaliacao);
        const cor = STATUS_COR[at.status] ?? STATUS_COR.NAO_INICIADO;
        const acao =
          at.status === 'CONCLUIDO' ? 'Ver resultado' : at.status === 'EM_ANDAMENTO' ? 'Continuar' : 'Responder';
        return (
          <View key={`${at.id_usuario}-${at.id_avaliacao}`} style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>{tituloDe(at.id_avaliacao)}</Text>
                {!!av?.descricao && <Text style={styles.itemMeta}>{av.descricao}</Text>}
                {av && (
                  <Text style={styles.itemMeta}>
                    {formatarData(av.data)} • {hhmm(av.hora_inicio)} às {hhmm(av.hora_fim)}
                  </Text>
                )}
              </View>
              <View style={[styles.badge, { backgroundColor: cor.fundo }]}>
                <Text style={[styles.badgeTexto, { color: cor.texto }]}>
                  {STATUS_ROTULO[at.status] ?? at.status}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <Botao
                titulo={acao}
                variante={at.status === 'CONCLUIDO' ? 'secundario' : 'primario'}
                onPress={() => abrir(at)}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const local = StyleSheet.create({
  alternativa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
  },
  alternativaMarcada: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioMarcado: { borderColor: '#2563EB' },
  radioMiolo: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563EB' },
});
