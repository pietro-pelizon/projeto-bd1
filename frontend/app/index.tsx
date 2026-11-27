import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AtribuicoesRespostasScreen from '../src/screens/AtribuicoesRespostasScreen';
import AvaliacoesScreen from '../src/screens/AvaliacoesScreen';
import QuestoesScreen from '../src/screens/QuestoesScreen';
import RelatoriosScreen from '../src/screens/RelatoriosScreen';
import UsuariosScreen from '../src/screens/UsuariosScreen';
import Shell from '../src/Shell';

export default function Home(){
  return <Shell />;
  }

type Aba = 'relatorios' | 'usuarios' | 'questoes' | 'avaliacoes' | 'atribuicoes';

const ABAS: { id: Aba; titulo: string }[] = [
  { id: 'relatorios', titulo: 'Relatórios' },
  { id: 'usuarios', titulo: 'Usuários' },
  { id: 'questoes', titulo: 'Questões' },
  { id: 'avaliacoes', titulo: 'Avaliações' },
  { id: 'atribuicoes', titulo: 'Atribuições & Respostas' },
];

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#0F172A',
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  container: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  tabAtiva: { backgroundColor: '#2563EB' },
  tabTexto: { color: '#CBD5E1', fontWeight: '600', fontSize: 14 },
  tabTextoAtivo: { color: '#FFFFFF' },
  scroll: { padding: 16, paddingBottom: 48 },
});