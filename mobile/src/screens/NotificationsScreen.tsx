import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, CloudRain, ShieldAlert } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { colors, radii, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const items = [
  {
    icon: CloudRain,
    color: colors.blue,
    bg: colors.ice,
    title: 'Chuva aumentou na Zona Noroeste',
    text: 'A estação registrou 18,6 mm na última hora.',
    time: 'há 4 min',
  },
  {
    icon: ShieldAlert,
    color: colors.amber,
    bg: colors.amberSoft,
    title: 'Novo relato próximo ao Bom Retiro',
    text: 'A comunidade informou uma via temporariamente bloqueada.',
    time: 'há 22 min',
  },
];

export function NotificationsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Notificações" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {items.map(({ icon: Icon, color, bg, title, text, time }) => (
          <View key={title} style={styles.item}>
            <View style={[styles.icon, { backgroundColor: bg }]}>
              <Icon color={color} size={21} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.text}>{text}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
          </View>
        ))}
        <View style={styles.emptyIcon}>
          <Bell color={colors.muted} size={22} />
        </View>
        <Text style={styles.endText}>Você está em dia com os avisos.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, backgroundColor: colors.canvas, flexGrow: 1 },
  item: { flexDirection: 'row', padding: spacing.lg, marginBottom: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, marginLeft: spacing.md },
  title: { ...typography.h3, color: colors.ink },
  text: { ...typography.small, color: colors.navySoft, marginTop: spacing.xs },
  time: { ...typography.caption, color: colors.muted, marginTop: spacing.sm },
  emptyIcon: { alignSelf: 'center', width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7ECEF', marginTop: spacing.xl },
  endText: { ...typography.small, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
});
