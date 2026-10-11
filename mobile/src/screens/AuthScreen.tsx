import * as ImagePicker from 'expo-image-picker';
import { LockKeyhole, MapPin, Phone, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/PrimaryButton';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing, typography } from '../theme';

type Mode = 'login' | 'register';

export function AuthScreen() {
  const login = useAppStore((state) => state.login);
  const register = useAppStore((state) => state.register);
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePhotoUri, setProfilePhotoUri] = useState('');
  const [loading, setLoading] = useState(false);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para escolher sua foto de perfil.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfilePhotoUri(result.assets[0].uri);
  };

  const submit = () => {
    if (!name.trim() || password.length < 4) {
      Alert.alert('Revise seus dados', 'Informe seu nome e uma senha com pelo menos 4 caracteres.');
      return;
    }
    if (mode === 'login') {
      setLoading(true);
      const valid = login(name, password);
      setLoading(false);
      if (!valid) Alert.alert('Não foi possível entrar', 'Confira o nome e a senha informados.');
      return;
    }
    if (!phone.trim() || !address.trim()) {
      Alert.alert('Complete seu cadastro', 'Informe telefone e endereço.');
      return;
    }
    setLoading(true);
    const created = register({
      name,
      password,
      phone,
      address,
      profilePhotoUri: profilePhotoUri || undefined,
    });
    setLoading(false);
    if (!created) Alert.alert('Nome já cadastrado', 'Escolha outro nome para criar sua conta.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>HP</Text>
          </View>
          <Text style={styles.eyebrow}>HYDRO PULSE</Text>
          <Text style={styles.title}>{mode === 'login' ? 'Entre para colaborar' : 'Crie sua conta'}</Text>
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'Acompanhe relatos, confirme ocorrências e ajude sua cidade.'
              : 'Seus dados ficam associados aos relatos que você enviar.'}
          </Text>

          <View style={styles.switcher}>
            <Pressable style={[styles.switchButton, mode === 'login' && styles.switchButtonActive]} onPress={() => setMode('login')}>
              <Text style={[styles.switchText, mode === 'login' && styles.switchTextActive]}>Entrar</Text>
            </Pressable>
            <Pressable style={[styles.switchButton, mode === 'register' && styles.switchButtonActive]} onPress={() => setMode('register')}>
              <Text style={[styles.switchText, mode === 'register' && styles.switchTextActive]}>Criar conta</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome</Text>
            <View style={styles.inputWrap}>
              <UserRound color={colors.blue} size={19} />
              <TextInput value={name} onChangeText={setName} placeholder="Como podemos chamar você?" placeholderTextColor={colors.muted} style={styles.input} autoCapitalize="words" />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrap}>
              <LockKeyhole color={colors.blue} size={19} />
              <TextInput value={password} onChangeText={setPassword} placeholder="Mínimo de 4 caracteres" placeholderTextColor={colors.muted} style={styles.input} secureTextEntry />
            </View>

            {mode === 'register' ? (
              <>
                <Text style={styles.label}>Telefone</Text>
                <View style={styles.inputWrap}>
                  <Phone color={colors.blue} size={19} />
                  <TextInput value={phone} onChangeText={setPhone} placeholder="(13) 99999-9999" placeholderTextColor={colors.muted} style={styles.input} keyboardType="phone-pad" />
                </View>

                <Text style={styles.label}>Endereço</Text>
                <View style={styles.inputWrap}>
                  <MapPin color={colors.blue} size={19} />
                  <TextInput value={address} onChangeText={setAddress} placeholder="Rua, número e bairro" placeholderTextColor={colors.muted} style={styles.input} />
                </View>

                <Text style={styles.label}>Foto de perfil <Text style={styles.optional}>(opcional)</Text></Text>
                <Pressable style={styles.photoButton} onPress={pickPhoto}>
                  {profilePhotoUri ? <Image source={{ uri: profilePhotoUri }} style={styles.photo} /> : <View style={styles.photoPlaceholder}><UserRound color={colors.blue} size={24} /></View>}
                  <View style={styles.photoCopy}>
                    <Text style={styles.photoTitle}>{profilePhotoUri ? 'Trocar foto' : 'Escolher foto'}</Text>
                    <Text style={styles.photoSubtitle}>Você pode adicionar uma imagem agora ou depois</Text>
                  </View>
                </Pressable>
              </>
            ) : null}
          </View>

          <PrimaryButton label={mode === 'login' ? 'Entrar' : 'Criar minha conta'} onPress={submit} loading={loading} />
          <Text style={styles.privacy}>Usamos seus dados apenas para identificar suas contribuições na comunidade.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  flex: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  brandMark: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navy },
  brandMarkText: { ...typography.h2, color: colors.sky },
  eyebrow: { ...typography.caption, color: colors.blue, letterSpacing: 1.4, marginTop: spacing.xxl },
  title: { ...typography.display, color: colors.ink, marginTop: spacing.xs },
  subtitle: { ...typography.body, color: colors.muted, marginTop: spacing.sm },
  switcher: { flexDirection: 'row', padding: 4, marginTop: spacing.xxl, borderRadius: radii.md, backgroundColor: '#E6EEF2' },
  switchButton: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radii.sm },
  switchButtonActive: { backgroundColor: colors.surface },
  switchText: { ...typography.small, color: colors.muted },
  switchTextActive: { color: colors.blueDark, fontWeight: '700' },
  form: { marginTop: spacing.xl, marginBottom: spacing.xxl },
  label: { ...typography.h3, color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm },
  inputWrap: { minHeight: 54, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, minHeight: 52, ...typography.body, color: colors.ink },
  photoButton: { minHeight: 78, padding: spacing.md, flexDirection: 'row', alignItems: 'center', borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderStyle: 'dashed', borderColor: '#9CCFE8' },
  photoPlaceholder: { width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ice },
  photo: { width: 50, height: 50, borderRadius: 17 },
  photoCopy: { flex: 1, marginLeft: spacing.md },
  photoTitle: { ...typography.h3, color: colors.blueDark },
  photoSubtitle: { ...typography.caption, color: colors.muted, marginTop: 2 },
  optional: { color: colors.muted, fontWeight: '500' },
  privacy: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.lg },
});
