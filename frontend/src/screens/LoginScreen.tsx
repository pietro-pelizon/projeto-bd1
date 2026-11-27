import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { useAuth } from '../auth';
import { Banner, Botao, styles } from '../ui';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const enviar = async () => {
    if (carregando) return;
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      await entrar(email, senha);
    } catch (e: any) {
      setErro(e.message || 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        minHeight: 480,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <View style={[styles.card, { width: '100%', maxWidth: 400, marginBottom: 0 }]}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>
          Sistema de Avaliações
        </Text>
        <Text style={[styles.subtitulo, { marginTop: 4, marginBottom: 12 }]}>
          Entre com o seu e-mail e senha.
        </Text>

        <Banner erro={erro} sucesso={null} onClose={() => setErro(null)} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="nome@uel.br"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={[styles.input, { marginBottom: 16 }]}
          value={senha}
          onChangeText={setSenha}
          placeholder="Sua senha"
          secureTextEntry
          autoCapitalize="none"
          onSubmitEditing={enviar}
          returnKeyType="go"
        />

        {carregando ? (
          <ActivityIndicator color="#2563EB" />
        ) : (
          <Botao titulo="Entrar" onPress={enviar} />
        )}
      </View>
    </View>
  );
}
