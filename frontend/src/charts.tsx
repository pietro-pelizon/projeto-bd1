import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Gráficos feitos só com <View>: não precisam de nenhuma biblioteca extra
// e funcionam no web, iOS e Android.

export interface ItemGrafico {
  rotulo: string;
  valor: number;
  detalhe?: string; // texto extra exibido no fim da barra (ex.: "3/10 erros")
}

interface BaseProps {
  itens: ItemGrafico[];
  max: number; // fim do eixo (ex.: 10 ou 100)
  cor: string;
  unidade?: string; // sufixo do valor (ex.: "%")
  casas?: number;
}

function ticks(max: number): number[] {
  return [0, 1, 2, 3, 4, 5].map((i) => (max * i) / 5); // 0, 2, 4, 6, 8, 10 (ou 0, 20, ... 100)
}

function formatar(v: number, casas = 1) {
  return v.toFixed(casas).replace('.', ',');
}

/** Barras horizontais: bom para rótulos longos (nomes de alunos). */
export function BarrasHorizontais({ itens, max, cor, unidade = '', casas = 2 }: BaseProps) {
  const marcas = ticks(max);
  return (
    <View>
      {itens.map((it, i) => {
        const pct = Math.min(100, Math.max(0, (it.valor / max) * 100));
        return (
          <View key={`${it.rotulo}-${i}`} style={g.linhaH}>
            <Text style={g.rotuloH} numberOfLines={1}>
              {it.rotulo}
            </Text>
            <View style={g.areaH}>
              {marcas.map((m, k) => (
                <View key={k} style={[g.gradeV, { left: `${(m / max) * 100}%` }]} />
              ))}
              <View style={[g.barraH, { width: `${pct}%`, backgroundColor: cor }]} />
            </View>
            <Text style={g.valorH}>
              {formatar(it.valor, casas)}
              {unidade}
              {it.detalhe ? `  (${it.detalhe})` : ''}
            </Text>
          </View>
        );
      })}
      <View style={g.eixoH}>
        <View style={{ width: 140 }} />
        <View style={g.eixoMarcasH}>
          {marcas.map((m, k) => (
            <Text key={k} style={g.marcaTexto}>
              {formatar(m, 0)}
              {unidade}
            </Text>
          ))}
        </View>
        <View style={{ width: 120 }} />
      </View>
    </View>
  );
}

/** Colunas verticais: bom para rótulos curtos (Q1, Q2, ...). Rola na horizontal se não couber. */
export function Colunas({ itens, max, cor, unidade = '', casas = 1 }: BaseProps) {
  const ALTURA = 220;
  const marcas = ticks(max);
  const LARG = itens.length <= 10 ? 76 : itens.length <= 16 ? 58 : 46; // largura de cada coluna
  return (
    <View style={{ flexDirection: 'row' }}>
      {/* eixo Y */}
      <View style={{ height: ALTURA, justifyContent: 'space-between', paddingRight: 6, marginTop: 22 }}>
        {[...marcas].reverse().map((m, k) => (
          <Text key={k} style={g.marcaTexto}>
            {formatar(m, 0)}
            {unidade}
          </Text>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          <View style={{ height: ALTURA + 22, justifyContent: 'flex-end' }}>
            {/* linhas de grade */}
            <View style={{ position: 'absolute', left: 0, right: 0, top: 22, height: ALTURA }}>
              {marcas.map((m, k) => (
                <View key={k} style={[g.gradeH, { top: ALTURA - (m / max) * ALTURA }]} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: ALTURA + 22 }}>
              {itens.map((it, i) => {
                const h = Math.min(ALTURA, Math.max(0, (it.valor / max) * ALTURA));
                return (
                  <View key={`${it.rotulo}-${i}`} style={[g.colunaBox, { width: LARG }]}>
                    <Text style={g.valorColuna}>
                      {formatar(it.valor, casas)}
                      {unidade}
                    </Text>
                    <View style={[g.coluna, { height: h, width: Math.min(34, LARG - 16), backgroundColor: cor }]} />
                  </View>
                );
              })}
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {itens.map((it, i) => (
              <Text key={`${it.rotulo}-r-${i}`} style={[g.rotuloColuna, { width: LARG }]} numberOfLines={1}>
                {it.rotulo}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const g = StyleSheet.create({
  linhaH: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rotuloH: { width: 140, fontSize: 12, color: '#334155', paddingRight: 8 },
  areaH: {
    flex: 1,
    height: 22,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  barraH: { height: '100%', borderRadius: 4 },
  gradeV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#E2E8F0' },
  valorH: { width: 120, fontSize: 12, fontWeight: '700', color: '#0F172A', paddingLeft: 8 },
  eixoH: { flexDirection: 'row', marginTop: 2 },
  eixoMarcasH: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  marcaTexto: { fontSize: 11, color: '#64748B' },
  gradeH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#E2E8F0' },
  colunaBox: { width: 46, alignItems: 'center', justifyContent: 'flex-end' },
  coluna: { width: 24, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  valorColuna: { fontSize: 10, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  rotuloColuna: { width: 46, textAlign: 'center', fontSize: 11, color: '#334155', marginTop: 4 },
});
