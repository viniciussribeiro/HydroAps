import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CloudRain, MapPin } from 'lucide-react-native';

import { colors, radii, spacing, typography } from '../theme';
import type { FloodReport, Station } from '../types/domain';

export function CityMap({
  stations,
  reports,
  onStationPress,
  onReportPress,
}: {
  stations: Station[];
  reports: FloodReport[];
  onStationPress?: (station: Station) => void;
  onReportPress?: (report: FloodReport) => void;
}) {
  return (
    <View style={styles.map}>
      <View style={styles.water} />
      {[18, 38, 62, 80].map((top) => (
        <View key={top} style={[styles.road, { top: `${top}%` }]} />
      ))}
      <View style={[styles.verticalRoad, { left: '28%' }]} />
      <View style={[styles.verticalRoad, { left: '67%' }]} />
      {stations.slice(0, 3).map((station, index) => (
        <Pressable
          key={station.id}
          style={[styles.marker, styles.stationMarker, markerPositions[index]]}
          onPress={() => onStationPress?.(station)}
          accessibilityLabel={`Estação ${station.name}`}
        >
          <CloudRain color={colors.white} size={15} />
        </Pressable>
      ))}
      {reports.slice(0, 3).map((report, index) => (
        <Pressable
          key={report.id}
          style={[styles.marker, styles.reportMarker, reportPositions[index]]}
          onPress={() => onReportPress?.(report)}
          accessibilityLabel={`Relato em ${report.address}`}
        >
          <MapPin color={colors.white} size={15} />
        </Pressable>
      ))}
      <View style={styles.label}>
        <Text style={styles.labelText}>Santos</Text>
        <Text style={styles.labelSub}>estações e relatos da comunidade</Text>
      </View>
    </View>
  );
}

const markerPositions = [
  { left: '22%' as const, top: '23%' as const },
  { left: '52%' as const, top: '58%' as const },
  { left: '72%' as const, top: '31%' as const },
];
const reportPositions = [
  { left: '36%' as const, top: '42%' as const },
  { left: '78%' as const, top: '67%' as const },
  { left: '56%' as const, top: '18%' as const },
];

const styles = StyleSheet.create({
  map: { flex: 1, minHeight: 340, backgroundColor: '#DCE9E3', overflow: 'hidden' },
  water: {
    position: 'absolute',
    right: '-10%',
    top: '-8%',
    width: '36%',
    height: '120%',
    transform: [{ rotate: '-8deg' }],
    backgroundColor: '#AEDDF3',
  },
  road: {
    position: 'absolute',
    left: '-10%',
    width: '115%',
    height: 7,
    backgroundColor: '#F7F4E9',
    transform: [{ rotate: '-4deg' }],
    borderTopWidth: 1,
    borderColor: '#CAD5CF',
  },
  verticalRoad: {
    position: 'absolute',
    top: '-10%',
    width: 7,
    height: '120%',
    backgroundColor: '#F7F4E9',
    transform: [{ rotate: '8deg' }],
    borderLeftWidth: 1,
    borderColor: '#CAD5CF',
  },
  marker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  stationMarker: { backgroundColor: colors.blue },
  reportMarker: { backgroundColor: colors.red },
  label: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  labelText: { ...typography.h3, color: colors.ink },
  labelSub: { ...typography.caption, color: colors.muted },
});
