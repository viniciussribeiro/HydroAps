import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Database,
  Info,
  LogOut,
  MapPinned,
  Pencil,
  ShieldCheck,
} from 'lucide-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { colors, radii, spacing, typography } from '../theme';
import { useAppStore } from '../store/useAppStore';
import type { MainTabParamList } from '../types/navigation';

type Props = BottomTabScreenProps<MainTabParamList, 'Perfil'>;

const options = [
  { icon: Bell, label: 'Notificações', detail: 'Alertas importantes' },
  { icon: MapPinned, label: 'Localização', detail: 'Santos - SP' },
  { icon: Database, label: 'Fontes de dados', detail: 'CEMADEN e Prefeitura' },
  { icon: ShieldCheck, label: 'Privacidade', detail: 'Dados e permissões' },
  { icon: CircleHelp, label: 'Ajuda', detail: 'Como usar o Hydro Pulse' },
];

export function ProfileScreen({ navigation }: Props) {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const openSection = (label: (typeof options)[number]['label']) => {
    if (label === 'Notificações') {
      navigation.getParent()?.navigate('Notifications');
      return;
    }

    const sectionByLabel = {
      Localização: 'location',
      'Fontes de dados': 'sources',
      Privacidade: 'privacy',
      Ajuda: 'help',
    } as const;
    navigation.getParent()?.navigate('ProfileSection', { section: sectionByLabel[label as keyof typeof sectionByLabel] });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Perfil e ajustes" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          {user?.profilePhotoUri ? <Image source={{ uri: user.profilePhotoUri }} style={styles.avatar} /> : <View style={styles.avatar}><Text style={styles.avatarText}>HP</Text></View>}
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>{user?.name ?? 'Colaborador'}</Text>
            <Text style={styles.profileSubtitle}>{user?.phone ?? 'Conta local'} · {user?.address ?? 'Contribuindo com informações da cidade'}</Text>
          </View>
        </View>

        <Pressable
          style={styles.editProfileButton}
          onPress={() => navigation.getParent()?.navigate('ProfileEdit')}
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
        >
          <Pencil color={colors.blue} size={18} />
          <Text style={styles.editProfileText}>Editar perfil</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <LogOut color={colors.red} size={18} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>PREFERÊNCIAS</Text>
        <View style={styles.menu}>
          {options.map(({ icon: Icon, label, detail }, index) => (
            <Pressable
              key={label}
              style={[styles.menuItem, index < options.length - 1 && styles.menuDivider]}
              onPress={() => openSection(label)}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${label}`}
            >
              <View style={styles.menuIcon}>
                <Icon color={colors.blue} size={20} />
              </View>
              <View style={styles.menuCopy}>
                <Text style={styles.menuTitle}>{label}</Text>
                <Text style={styles.menuDetail}>{detail}</Text>
              </View>
              <ChevronRight color={colors.muted} size={19} />
            </Pressable>
          ))}
        </View>

        <View style={styles.aboutCard}>
          <Info color={colors.blue} size={21} />
          <View style={styles.aboutCopy}>
            <Text style={styles.aboutTitle}>Sobre o Hydro Pulse</Text>
            <Text style={styles.aboutText}>
              Protótipo acadêmico para consulta de chuva e relatos colaborativos. Não substitui alertas oficiais.
            </Text>
            <Text style={styles.version}>Versão 1.0.0 · Front-end demonstrativo</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, paddingBottom: 120, backgroundColor: colors.canvas },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.xl, borderRadius: radii.lg, backgroundColor: colors.navy },
  avatar: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  avatarText: { ...typography.h2, color: colors.white },
  profileCopy: { flex: 1, marginLeft: spacing.lg },
  profileTitle: { ...typography.h3, color: colors.white },
  profileSubtitle: { ...typography.caption, color: '#A9C7D8', marginTop: 3 },
  editProfileButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md, paddingVertical: spacing.sm },
  editProfileText: { ...typography.small, color: colors.blue, fontWeight: '700' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md, paddingVertical: spacing.sm },
  logoutText: { ...typography.small, color: colors.red, fontWeight: '700' },
  sectionLabel: { ...typography.caption, color: colors.muted, letterSpacing: 0.8, marginTop: spacing.xxl, marginBottom: spacing.sm },
  menu: { borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  menuItem: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ice },
  menuCopy: { flex: 1, marginLeft: spacing.md },
  menuTitle: { ...typography.h3, color: colors.ink },
  menuDetail: { ...typography.caption, color: colors.muted, marginTop: 2 },
  aboutCard: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.ice },
  aboutCopy: { flex: 1 },
  aboutTitle: { ...typography.h3, color: colors.blueDark },
  aboutText: { ...typography.small, color: colors.blueDark, marginTop: spacing.xs },
  version: { ...typography.caption, color: colors.muted, marginTop: spacing.md },
});
