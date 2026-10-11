import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AlertTriangle,
  ArrowRight,
  CloudRain,
  Map,
  Radio,
  ShieldCheck,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { ReportCard } from '../components/ReportCard';
import { SectionTitle } from '../components/SectionTitle';
import { StationCard } from '../components/StationCard';
import { citySummary, rainHistory, stations } from '../data/mock';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing, typography } from '../theme';
import type { MainTabParamList } from '../types/navigation';

type Props = BottomTabScreenProps<MainTabParamList, 'Inicio'>;

export function HomeScreen({ navigation }: Props) {
  const reports = useAppStore((state) => state.reports);
  const maxRain = Math.max(...rainHistory.map((item) => item.value));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader
        subtitle="Santos - SP"
        onNotifications={() => navigation.getParent()?.navigate('Notifications')}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[colors.navy, '#0A4168']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View>
              <View style={styles.liveBadge}>
                <Radio color={colors.aqua} size={12} />
                <Text style={styles.liveText}>MONITORAMENTO ATIVO</Text>
              </View>
              <Text style={styles.heroTitle}>Santos em atenção</Text>
              <Text style={styles.heroSubtitle}>Chuva moderada nas últimas horas</Text>
            </View>
            <View style={styles.weatherIcon}>
              <CloudRain color={colors.white} size={30} />
            </View>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroValue}>{citySummary.rainfall24hMm.toFixed(1).replace('.', ',')}</Text>
              <Text style={styles.heroLabel}>mm em 24h</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroValue}>{citySummary.activeReports}</Text>
              <Text style={styles.heroLabel}>relatos ativos</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroValue}>{citySummary.stationsOnline}</Text>
              <Text style={styles.heroLabel}>estações online</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.quickActions}>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('Mapa')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.ice }]}>
              <Map color={colors.blue} size={22} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Ver mapa</Text>
              <Text style={styles.actionSubtitle}>Pontos e ocorrências</Text>
            </View>
            <ArrowRight color={colors.muted} size={18} />
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => navigation.navigate('Relatar')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.amberSoft }]}>
              <AlertTriangle color={colors.amber} size={22} />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Relatar agora</Text>
              <Text style={styles.actionSubtitle}>Informe um alagamento</Text>
            </View>
            <ArrowRight color={colors.muted} size={18} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Chuva agora" action="Ver no mapa" onAction={() => navigation.navigate('Mapa')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalBreakout}>
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onPress={() => navigation.getParent()?.navigate('StationDetail', { stationId: station.id })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Precipitação nas últimas horas" />
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartLabel}>Acumulado</Text>
                <Text style={styles.chartValue}>41,0 <Text style={styles.chartUnit}>mm</Text></Text>
              </View>
              <Text style={styles.chartSource}>CEMADEN · Vila Mathias</Text>
            </View>
            <View style={styles.chart}>
              {rainHistory.map((item, index) => (
                <View key={item.label} style={styles.barGroup}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.max(14, (item.value / maxRain) * 100)}%`,
                          backgroundColor: index === rainHistory.length - 1 ? colors.sky : '#A7DDF8',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title="Relatos recentes" action="Ver todos" onAction={() => navigation.navigate('Atividade')} />
          {reports.slice(0, 2).map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onPress={() => navigation.getParent()?.navigate('ReportDetail', { reportId: report.id })}
            />
          ))}
        </View>

        <View style={styles.disclaimer}>
          <ShieldCheck color={colors.blue} size={20} />
          <Text style={styles.disclaimerText}>
            Dados de chuva não confirmam alagamentos. Siga sempre as orientações da Defesa Civil.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: 110, backgroundColor: colors.canvas },
  hero: { margin: spacing.lg, padding: spacing.xl, borderRadius: radii.xl, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.md },
  liveText: { ...typography.caption, color: '#9EE8DF', letterSpacing: 0.7 },
  heroTitle: { ...typography.h1, color: colors.white, letterSpacing: -0.5 },
  heroSubtitle: { ...typography.small, color: '#B9D4E4', marginTop: 3 },
  weatherIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  heroStat: { flex: 1 },
  heroValue: { ...typography.h2, color: colors.white },
  heroLabel: { ...typography.caption, color: '#9FBED0', marginTop: 2 },
  heroDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.14)', marginRight: spacing.md },
  quickActions: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  actionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionCopy: { flex: 1, marginLeft: spacing.md },
  actionTitle: { ...typography.h3, color: colors.ink },
  actionSubtitle: { ...typography.caption, color: colors.muted, marginTop: 2 },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xxl },
  horizontalBreakout: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  chartCard: { padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  chartHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  chartLabel: { ...typography.caption, color: colors.muted },
  chartValue: { ...typography.h1, color: colors.ink, marginTop: 2 },
  chartUnit: { ...typography.small, color: colors.muted },
  chartSource: { ...typography.caption, color: colors.muted, maxWidth: 140, textAlign: 'right' },
  chart: { height: 130, marginTop: spacing.lg, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  barGroup: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack: { flex: 1, width: '68%', justifyContent: 'flex-end', backgroundColor: colors.canvas, borderRadius: 8, overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 8 },
  barLabel: { ...typography.caption, color: colors.muted, marginTop: 6 },
  disclaimer: { flexDirection: 'row', gap: spacing.md, margin: spacing.lg, marginTop: spacing.xxl, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.ice },
  disclaimerText: { ...typography.small, color: colors.blueDark, flex: 1 },
});
