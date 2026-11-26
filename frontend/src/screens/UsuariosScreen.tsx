import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { api } from '../api';
import type { Usuario } from '../types';
import { Banner, Botao, Chip, confirmarAcao, styles } from '../ui';

const VAZIO: Usuario = { nome: '', email: '', senha: '', tipo: 'ALUNO' };

export default function UsuariosScreen() {
  const [lista, setLista] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Usuario>(VAZIO);
  const [editId, setEditId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const carregar = async () => {
    try {
      setLista(await api.usuarios.listar());
    } catch (e: any) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const salvar = async () => {
    setErro(null);
    setSucesso(null);
    try {
      if (editId !== null) {
        await api.usuarios.atualizar(editId, form);
        setSucesso('Usuário atualizado com sucesso!');
      } else {
        await api.usuarios.criar(form);
        setSucesso('Usuário cadastrado com sucesso!');
      }
      setForm(VAZIO);
      setEditId(null);
      carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const iniciarEdicao = (u: Usuario) => {
    setEditId(u.id ?? null);
    setForm({ nome: u.nome, email: u.email, senha: u.senha || '', tipo: u.tipo });
  };

  const excluir = (id: number) => {
    confirmarAcao(`Excluir usuário #${id}?`, async () => {
      try {
        await api.usuarios.excluir(id);
        setSucesso('Usuário excluído.');
        carregar();
      } catch (e: any) {
        setErro(e.message);
      }
    });
  };

  return (
    <View>
      <Banner erro={erro} sucesso={sucesso} onClose={() => { setErro(null); setSucesso(null); }} />

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          {editId !== null ? `Editar Usuário #${editId}` : 'Novo Usuário'}
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={form.nome}
          onChangeText={(nome) => setForm({ ...form, nome })}
          placeholder="Ex: Maria Silva"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(email) => setForm({ ...form, email })}
          placeholder="maria@uel.br"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={form.senha}
          onChangeText={(senha) => setForm({ ...form, senha })}
          placeholder="Digite a senha"
          secureTextEntry
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={[styles.row, { marginBottom: 12 }]}>
          {['ALUNO', 'PROFESSOR'].map((t) => (
            <Chip
              key={t}
              label={t}
              ativo={form.tipo === t}
              onPress={() => setForm({ ...form, tipo: t })}
            />
          ))}
        </View>

        <View style={styles.row}>
          <Botao titulo={editId !== null ? 'Salvar Alterações' : 'Cadastrar'} onPress={salvar} />
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
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitulo}>Usuários Cadastrados ({lista.length})</Text>
          <Botao titulo="Recarregar" variante="secundario" pequeno onPress={carregar} />
        </View>
        {lista.map((u) => (
          <View key={u.id} style={styles.itemBox}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.itemTitulo}>
                  #{u.id} — {u.nome}
                </Text>
                <Text style={styles.itemMeta}>
                  {u.email} • {u.tipo}
                </Text>
              </View>
              <View style={styles.row}>
                <Botao titulo="Editar" variante="secundario" pequeno onPress={() => iniciarEdicao(u)} />
                {u.id !== undefined && (
                  <Botao titulo="Excluir" variante="perigo" pequeno onPress={() => excluir(u.id!)} />
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}