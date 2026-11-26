import React from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function confirmarAcao(mensagem: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) onConfirm();
    return;
  }
  Alert.alert('Confirmar', mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Confirmar', style: 'destructive', onPress: onConfirm },
  ]);
}

export function Banner({
  erro,
  sucesso,
  onClose,
}: {
  erro: string | null;
  sucesso: string | null;
  onClose: () => void;
}) {
  if (!erro && !sucesso) return null;
  const isErro = Boolean(erro);
  return (
    <View style={[styles.banner, isErro ? styles.bannerErro : styles.bannerSucesso]}>
      <Text style={[styles.bannerTexto, isErro ? styles.textoErro : styles.textoSucesso]}>
        {erro || sucesso}
      </Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={[styles.bannerFechar, isErro ? styles.textoErro : styles.textoSucesso]}>
          ✕
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  pequeno = false,
}: {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo' | 'sucesso';
  pequeno?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        pequeno && styles.btnPequeno,
        variante === 'primario' && styles.btnPrimario,
        variante === 'secundario' && styles.btnSecundario,
        variante === 'perigo' && styles.btnPerigo,
        variante === 'sucesso' && styles.btnSucesso,
      ]}
    >
      <Text
        style={[
          styles.btnTexto,
          pequeno && styles.btnTextoPequeno,
          variante === 'secundario' && styles.btnTextoSecundario,
        ]}
      >
        {titulo}
      </Text>
    </TouchableOpacity>
  );
}

export function Chip({
  label,
  ativo,
  onPress,
}: {
  label: string;
  ativo: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, ativo && styles.chipAtivo]}>
      <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{label}</Text>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  itemTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemMeta: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPequeno: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btnPrimario: { backgroundColor: '#2563EB' },
  btnSecundario: { backgroundColor: '#E2E8F0' },
  btnPerigo: { backgroundColor: '#DC2626' },
  btnSucesso: { backgroundColor: '#16A34A' },
  btnTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  btnTextoPequeno: { fontSize: 12 },
  btnTextoSecundario: { color: '#1E293B' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  chipAtivo: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipTexto: { fontSize: 13, fontWeight: '600', color: '#334155' },
  chipTextoAtivo: { color: '#FFFFFF' },
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  bannerErro: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  bannerSucesso: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  bannerTexto: { fontSize: 14, fontWeight: '600', flex: 1, marginRight: 8 },
  bannerFechar: { fontSize: 16, fontWeight: '700' },
  textoErro: { color: '#991B1B' },
  textoSucesso: { color: '#166534' },
  barraFundo: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 6,
  },
  barraPreenchimento: {
    height: '100%',
    borderRadius: 999,
  },
});