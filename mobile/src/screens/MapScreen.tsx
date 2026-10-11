import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Layers3, ListFilter, LocateFixed, Search } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CityMap } from '../components/CityMap';
import { ReportCard } from '../components/ReportCard';
import { stations } from '../data/mock';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, shadows, spacing, typography } from '../theme';
import type { MainTabParamList } from '../types/navigation';

type Props = BottomTabScreenProps<MainTabParamList, 'Mapa'>;

export function MapScreen({ navigation }: Props) {
  const reports = useAppStore((state) => state.reports);

  return (
    <View style={styles.container}>
      <CityMap
        stations={stations}
        reports={reports}
        onStationPress={(station) => navigation.getParent()?.navigate('StationDetail', { stationId: station.id })}
        onReportPress={(report) => navigation.getParent()?.navigate('ReportDetail', { reportId: report.id })}
      />
      <SafeAreaView style={StyleSheet.absoluteFill} edges={['top']} pointerEvents="box-none">
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Search color={colors.muted} size={20} />
            <TextInput
              placeholder="Buscar rua ou bairro"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
            <Pressable style={styles.filterButton}>
              <ListFilter color={colors.ink} size={19} />
            </Pressable>
          </View>
          <View style={styles.filters}>
            <Pressable style={[styles.chip, styles.chipActive]}>
              <View style={[styles.chipDot, { backgroundColor: colors.blue }]} />
              <Text style={styles.chipActiveText}>Estações</Text>
            </Pressable>
            <Pressable style={[styles.chip, styles.chipActive]}>
              <View style={[styles.chipDot, { backgroundColor: colors.red }]} />
              <Text style={styles.chipActiveText}>Relatos</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.mapActions}>
          <Pressable style={styles.mapButton} accessibilityLabel="Camadas do mapa">
            <Layers3 color={colors.ink} size={20} />
          </Pressable>
          <Pressable style={styles.mapButton} accessibilityLabel="Minha localização">
            <LocateFixed color={colors.blue} size={21} />
          </Pressable>
        </View>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Ocorrências próximas</Text>
              <Text style={styles.sheetSubtitle}>Informações colaborativas não verificadas</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{reports.length}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reportRow}>
            {reports.map((report) => (
              <View key={report.id} style={styles.reportCardWrap}>
                <ReportCard
                  report={report}
                  onPress={() => navigation.getParent()?.navigate('ReportDetail', { reportId: report.id })}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DCE9E3' },
  searchWrap: { padding: spacing.lg, pointerEvents: 'auto' },
  searchBar: { height: 54, borderRadius: radii.md, paddingLeft: spacing.lg, paddingRight: 7, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, ...shadows.card },
  searchInput: { flex: 1, height: '100%', paddingHorizontal: spacing.md, ...typography.body, color: colors.ink, outlineStyle: 'none' } as never,
  filterButton: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: spacing.md, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.9)' },
  chipActive: { borderWidth: 1, borderColor: colors.line },
  chipDot: { width: 7, height: 7, borderRadius: 4 },
  chipActiveText: { ...typography.small, color: colors.ink },
  mapActions: { position: 'absolute', right: spacing.lg, top: 168, gap: spacing.sm, pointerEvents: 'auto' },
  mapButton: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, ...shadows.card },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: spacing.sm, paddingBottom: spacing.md, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: colors.surface, pointerEvents: 'auto' },
  handle: { alignSelf: 'center', width: 42, height: 4, borderRadius: 2, backgroundColor: colors.line },
  sheetHeader: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { ...typography.h2, color: colors.ink },
  sheetSubtitle: { ...typography.caption, color: colors.muted, marginTop: 2 },
  countBadge: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.redSoft },
  countText: { ...typography.h3, color: colors.red },
  reportRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  reportCardWrap: { width: 290, marginRight: spacing.md },
});
