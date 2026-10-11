import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BellRing,
  CircleHelp,
  Database,
  MapPinned,
  ShieldCheck,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { colors, radii, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSection'>;
type Icon = ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;

const sections: Record<
  RootStackParamList['ProfileSection']['section'],
  {
    title: string;
    icon: Icon;
    intro: string;
    rows: Array<{ label: string; value: string; description?: string }>;
  }
> = {
  location: {
    title: 'Localização',
    icon: MapPinned,
    intro: 'A localização é usada para posicionar relatos e mostrar informações da sua região.',
    rows: [
      { label: 'Cidade monitorada', value: 'Santos - SP' },
      { label: 'Precisão', value: 'Aproximada', description: 'O endereço informado no relato pode ser ajustado antes do envio.' },
    ],
  },
  sources: {
    title: 'Fontes de dados',
    icon: Database,
    intro: 'O Hydro Pulse reúne fontes institucionais e contribuições da comunidade em uma única visualização.',
    rows: [
      { label: 'Estações de chuva', value: 'CEMADEN e Prefeitura de Santos' },
      { label: 'Relatos', value: 'Comunidade Hydro Pulse', description: 'Relatos são colaborativos e podem aguardar confirmação.' },
    ],
  },
  privacy: {
    title: 'Privacidade',
    icon: ShieldCheck,
    intro: 'Você controla as permissões utilizadas pelo aplicativo. Nenhum dado é enviado sem uma ação sua.',
    rows: [
      { label: 'Localização', value: 'Somente durante o uso' },
      { label: 'Relatos pendentes', value: 'Salvos neste aparelho', description: 'Quando a conexão voltar, eles poderão ser sincronizados com o serviço.' },
    ],
  },
  help: {
    title: 'Ajuda',
    icon: CircleHelp,
    intro: 'Consulte as orientações rápidas para usar o Hydro Pulse.',
    rows: [
      { label: 'Como relatar?', value: 'Use o botão Relatar', description: 'Informe a situação, o local e uma descrição objetiva.' },
      { label: 'Como interpretar o mapa?', value: 'Azul = estação · vermelho = relato', description: 'Toque em um marcador para abrir seus detalhes.' },
    ],
  },
};

export function ProfileSectionScreen({ navigation, route }: Props) {
  const section = sections[route.params.section];
  const Icon = section.icon;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title={section.title} onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon color={colors.white} size={25} />
          </View>
          <Text style={styles.heroTitle}>{section.title}</Text>
          <Text style={styles.heroText}>{section.intro}</Text>
        </View>

        <View style={styles.card}>
          {section.rows.map((row, index) => (
            <View key={row.label} style={[styles.row, index < section.rows.length - 1 && styles.rowDivider]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
              {row.description ? <Text style={styles.rowDescription}>{row.description}</Text> : null}
            </View>
          ))}
        </View>

        {route.params.section === 'privacy' ? (
          <Pressable style={styles.action} onPress={() => navigation.goBack()}>
            <BellRing color={colors.blue} size={19} />
            <Text style={styles.actionText}>Gerenciar permissões nas configurações do aparelho</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  content: { flexGrow: 1, padding: spacing.lg, paddingBottom: spacing.xxxl, backgroundColor: colors.canvas },
  hero: { padding: spacing.xl, borderRadius: radii.xl, backgroundColor: colors.navy },
  heroIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  heroTitle: { ...typography.h1, color: colors.white, marginTop: spacing.lg },
  heroText: { ...typography.body, color: '#B9D4E4', marginTop: spacing.sm },
  card: { marginTop: spacing.xl, paddingHorizontal: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  row: { paddingVertical: spacing.lg },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLabel: { ...typography.caption, color: colors.muted, letterSpacing: 0.3 },
  rowValue: { ...typography.h3, color: colors.ink, marginTop: spacing.xs },
  rowDescription: { ...typography.small, color: colors.muted, marginTop: spacing.xs },
  action: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.ice },
  actionText: { ...typography.small, color: colors.blueDark, flex: 1, fontWeight: '700' },
});
