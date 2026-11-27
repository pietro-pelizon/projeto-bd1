import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './auth';
import AlunoScreen from './screens/AlunoScreen';
import AtribuicoesRespostasScreen from './screens/AtribuicoesRespostasScreen';
import AvaliacoesScreen from './screens/AvaliacoesScreen';
import LoginScreen from './screens/LoginScreen';
import QuestoesScreen from './screens/QuestoesScreen';
import RelatoriosScreen from './screens/RelatoriosScreen';
import UsuariosScreen from './screens/UsuariosScreen';
import { Botao, Chip, styles } from './ui';

// Abas que só o PROFESSOR enxerga.
const ABAS_PROFESSOR = [
  { id: 'questoes', rotulo: 'Questões', tela: QuestoesScreen },
  { id: 'avaliacoes', rotulo: 'Avaliações', tela: AvaliacoesScreen },
  { id: 'atribuicoes', rotulo: 'Atribuições e Respostas', tela: AtribuicoesRespostasScreen },
  { id: 'usuarios', rotulo: 'Usuários', tela: UsuariosScreen },
  { id: 'relatorios', rotulo: 'Relatórios', tela: RelatoriosScreen },
] as const;

function Conteudo() {
  const { usuario, pronto, sair } = useAuth();
  const [aba, setAba] = useState<string>('questoes');

  if (!pronto) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F1F5F9' }} contentContainerStyle={{ flexGrow: 1 }}>
        <LoginScreen />
      </ScrollView>
    );
  }

  // Menor privilégio: qualquer tipo diferente de PROFESSOR é tratado como aluno.
  const ehProfessor = usuario.tipo === 'PROFESSOR';
  const AbaAtual = ABAS_PROFESSOR.find((a) => a.id === aba)?.tela ?? QuestoesScreen;

  return (
    <View style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View style={[styles.rowBetween, { maxWidth: 1100, width: '100%', alignSelf: 'center' }]}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Sistema de Avaliações</Text>
            <Text style={styles.itemMeta}>
              {usuario.nome} • {ehProfessor ? 'Professor' : 'Aluno'}
            </Text>
          </View>
          <Botao titulo="Sair" variante="secundario" pequeno onPress={sair} />
        </View>

        {ehProfessor && (
          <View style={[styles.row, { maxWidth: 1100, width: '100%', alignSelf: 'center', marginTop: 12 }]}>
            {ABAS_PROFESSOR.map((a) => (
              <Chip key={a.id} label={a.rotulo} ativo={aba === a.id} onPress={() => setAba(a.id)} />
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ maxWidth: 1100, width: '100%', alignSelf: 'center' }}>
          {ehProfessor ? <AbaAtual /> : <AlunoScreen />}
        </View>
      </ScrollView>
    </View>
  );
}

export default function Shell() {
  return (
    <AuthProvider>
      <Conteudo />
    </AuthProvider>
  );
}
