import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { api } from '../api';
import type { Alternativa, Questao, TipoQuestao } from '../types';
import { Banner, Botao, Chip, confirmarAcao, styles } from '../ui';

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const criarAlternativasPadrao = (): Alternativa[] => [
  { letra: 'A', texto: '', correta: true },
  { letra: 'B', texto: '', correta: false },
  { letra: 'C', texto: '', correta: false },
  { letra: 'D', texto: '', correta: false },
];

export default function QuestoesScreen() {
  const [lista, setLista] = useState<Questao[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [enunciado, setEnunciado] = useState('');
  const [tipo, setTipo] = useState<TipoQuestao>('MULTIPLA_ESCOLHA');
  const [alternativas, setAlternativas] = useState<Alternativa[]>(criarAlternativasPadrao());
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const carregar = async () => {
    try {
      setLista(await api.questoes.listar());
    } catch (e: any) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const limpar = () => {
    setEditId(null);
    setEnunciado('');
    setTipo('MULTIPLA_ESCOLHA');
    setAlternativas(criarAlternativasPadrao());
  };

  const salvar = async () => {
    setErro(null);
    setSucesso(null);
    const payload: Questao = {
      enunciado,
      tipo,
      alternativas: tipo === 'MULTIPLA_ESCOLHA' ? alternativas : [],
    };
    try {
      if (editId !== null) {
        await api.questoes.atualizar(editId, payload);
        setSucesso(`Questão #${editId} atualizada!`);
      } else {
        const res = await api.questoes.criar(payload);
        setSucesso(`Questão #${res.id} criada!`);
      }
      limpar();
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const editar = (q: Questao) => {
    setEditId(q.id ?? null);
    setEnunciado(q.enunciado);
    setTipo(q.tipo);
    setAlternativas(
      q.alternativas && q.alternativas.length > 0 ? q.alternativas : criarAlternativasPadrao()
    );
  };

  const excluir = (id: number) => {
    confirmarAcao(`Excluir questão #${id}?`, async () => {
      try {
        await api.questoes.excluir(id);
        setSucesso('Questão excluída.');
        carregar();
      } catch (e: any) {
        setErro(e.message);
      }
    });
  };

  const adicionarAlternativa = () => {
    if (alternativas.length >= LETRAS.length) return;
    setAlternativas([
      ...alternativas,
      { letra: LETRAS[alternativas.length], texto: '', correta: false },
    ]);
  };

  const marcarCorreta = (index: number) => {
    setAlternativas(alternativas.map((alt, i) => ({ ...alt, correta: i === index })));
  };

  return (
    <View>
      <Banner erro={erro} sucesso={sucesso} onClose={() => { setErro(null); setSucesso(null); }} />

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          {editId !== null ? `Editar Questão #${editId}` : 'Nova Questão'}
        </Text>

        <Text style={styles.label}>Enunciado</Text>
        <TextInput
          style={[styles.input, { minHeight: 70 }]}
          multiline
          value={enunciado}
          onChangeText={setEnunciado}
          placeholder="Digite o enunciado da questão..."
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={[styles.row, { marginBottom: 10 }]}>
          <Chip
            label="Múltipla Escolha"
            ativo={tipo === 'MULTIPLA_ESCOLHA'}
            onPress={() => setTipo('MULTIPLA_ESCOLHA')}
          />
          <Chip
            label="Discursiva"
            ativo={tipo === 'DISCURSIVA'}
            onPress={() => setTipo('DISCURSIVA')}
          />
        </View>

        {tipo === 'MULTIPLA_ESCOLHA' && (
          <View style={{ marginBottom: 12 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Alternativas (A–G)</Text>
              {alternativas.length < 7 && (
                <Botao titulo="+ Alternativa" variante="secundario" pequeno onPress={adicionarAlternativa} />
              )}
            </View>

            {alternativas.map((alt, idx) => (
              <View key={alt.letra} style={[styles.row, { marginTop: 6 }]}>
                <Chip
                  label={alt.correta ? `${alt.letra} ✓` : alt.letra}
                  ativo={alt.correta}
                  onPress={() => marcarCorreta(idx)}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={alt.texto}
                  placeholder={`Texto da alternativa ${alt.letra}`}
                  onChangeText={(texto) =>
                    setAlternativas(alternativas.map((a, i) => (i === idx ? { ...a, texto } : a)))
                  }
                />
              </View>
            ))}
          </View>
        )}

        <View style={styles.row}>
          <Botao titulo={editId !== null ? 'Salvar Alterações' : 'Criar Questão'} onPress={salvar} />
          {editId !== null && <Botao titulo="Cancelar" variante="secundario" onPress={limpar} />}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitulo}>Banco de Questões ({lista.length})</Text>
          <Botao titulo="Recarregar" variante="secundario" pequeno onPress={carregar} />
        </View>

        {lista.map((q) => (
          <View key={q.id} style={styles.itemBox}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>
                  #{q.id} — {q.enunciado}
                </Text>
                <Text style={styles.itemMeta}>Tipo: {q.tipo}</Text>
                {q.alternativas?.map((a) => (
                  <Text
                    key={a.letra}
                    style={[
                      styles.itemMeta,
                      a.correta && { color: '#166534', fontWeight: '700' },
                    ]}
                  >
                    {a.letra}) {a.texto} {a.correta ? '✓ (Correta)' : ''}
                  </Text>
                ))}
              </View>
              <View style={styles.row}>
                <Botao titulo="Editar" variante="secundario" pequeno onPress={() => editar(q)} />
                {q.id !== undefined && (
                  <Botao titulo="Excluir" variante="perigo" pequeno onPress={() => excluir(q.id!)} />
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}