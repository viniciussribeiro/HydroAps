import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CloudOff, RefreshCw, Wifi } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { ReportCard } from '../components/ReportCard';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing, typography } from '../theme';
import type { MainTabParamList } from '../types/navigation';

type Props = BottomTabScreenProps<MainTabParamList, 'Atividade'>;

export function ActivityScreen({ navigation }: Props) {
  const reports = useAppStore((state) => state.reports);
  const isOnline = useAppStore((state) => state.isOnline);
  const networkAvailable = useAppStore((state) => state.networkAvailable);
  const setSimulateOffline = useAppStore((state) => state.setSimulateOffline);
  const syncPending = useAppStore((state) => state.syncPending);
  const pending = reports.filter((report) => report.status !== 'synced');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Atividade" subtitle="Fila e histórico de relatos" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.connectionCard, isOnline ? styles.onlineCard : styles.offlineCard]}>
          <View style={styles.connectionIcon}>
            {isOnline ? <Wifi color={colors.green} size={22} /> : <CloudOff color={colors.amber} size={22} />}
          </View>
          <View style={styles.connectionCopy}>
            <Text style={styles.connectionTitle}>{isOnline ? 'Você está online' : 'Modo offline ativo'}</Text>
            <Text style={styles.connectionSubtitle}>
              {isOnline ? 'Operações podem ser sincronizadas' : 'Novos relatos ficarão salvos no aparelho'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={(enabled) => setSimulateOffline(!enabled)}
            trackColor={{ false: '#E3B65C', true: '#8DDFCA' }}
            thumbColor={colors.white}
          />
        </View>
        <Text style={styles.connectionHint}>
          {networkAvailable
            ? 'Rede detectada automaticamente. Use o interruptor para simular uma falha.'
            : 'O dispositivo não possui acesso à internet no momento.'}
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{pending.length}</Text>
            <Text style={styles.summaryLabel}>aguardando envio</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{reports.filter((item) => item.status === 'synced').length}</Text>
            <Text style={styles.summaryLabel}>sincronizados</Text>
          </View>
        </View>

        {pending.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pendentes</Text>
              <Text style={styles.sectionHint}>Persistidos localmente</Text>
            </View>
            {pending.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onPress={() => navigation.getParent()?.navigate('ReportDetail', { reportId: report.id })}
              />
            ))}
            <PrimaryButton
              label={isOnline ? 'Sincronizar agora' : 'Conecte-se para sincronizar'}
              onPress={syncPending}
              disabled={!isOnline}
              icon={<RefreshCw color={colors.white} size={18} />}
            />
          </View>
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <RefreshCw color={colors.green} size={28} />
            </View>
            <Text style={styles.emptyTitle}>Tudo sincronizado</Text>
            <Text style={styles.emptyText}>Não há operações aguardando envio neste dispositivo.</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico recente</Text>
          <View style={styles.spacer} />
          {reports
            .filter((report) => report.status === 'synced')
            .map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onPress={() => navigation.getParent()?.navigate('ReportDetail', { reportId: report.id })}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, paddingBottom: 120, backgroundColor: colors.canvas },
  connectionCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1 },
  onlineCard: { backgroundColor: colors.greenSoft, borderColor: '#B3E7D6' },
  offlineCard: { backgroundColor: colors.amberSoft, borderColor: '#F1D18D' },
  connectionIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  connectionCopy: { flex: 1, marginLeft: spacing.md },
  connectionTitle: { ...typography.h3, color: colors.ink },
  connectionSubtitle: { ...typography.caption, color: colors.muted, marginTop: 2 },
  connectionHint: {
    ...typography.caption,
    color: colors.muted,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.sm,
  },
  summaryRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  summaryCard: { flex: 1, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  summaryValue: { ...typography.h1, color: colors.ink },
  summaryLabel: { ...typography.caption, color: colors.muted, marginTop: 2 },
  section: { marginTop: spacing.xxl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionTitle: { ...typography.h2, color: colors.ink },
  sectionHint: { ...typography.caption, color: colors.muted },
  spacer: { height: spacing.md },
  empty: { alignItems: 'center', marginTop: spacing.xxl, padding: spacing.xxl, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  emptyIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.greenSoft },
  emptyTitle: { ...typography.h2, color: colors.ink, marginTop: spacing.lg },
  emptyText: { ...typography.small, color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
});
