import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Camera, Check, Clock3, MapPin, MessageCircle, Pencil, ShieldAlert, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusPill } from '../components/StatusPill';
import { useAppStore } from '../store/useAppStore';
import { colors, radii, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types/navigation';
import { formatDateTime } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportDetail'>;

export function ReportDetailScreen({ navigation, route }: Props) {
  const reports = useAppStore((state) => state.reports);
  const user = useAppStore((state) => state.user);
  const confirmedReportIds = useAppStore((state) => state.confirmedReportIds);
  const confirmReport = useAppStore((state) => state.confirmReport);
  const submitDispute = useAppStore((state) => state.submitDispute);
  const report = reports.find((item) => item.id === route.params.reportId) ?? reports[0];
  const [showDispute, setShowDispute] = useState(false);
  const [justification, setJustification] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const confirmed = confirmedReportIds.includes(report.id);
  const isOwner = report.authorId === user?.id;

  const pickEvidence = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para anexar uma evidência.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const sendDispute = async () => {
    if (justification.trim().length < 10) {
      Alert.alert('Explique melhor', 'Escreva uma justificativa com pelo menos 10 caracteres.');
      return;
    }
    setSubmittingDispute(true);
    await submitDispute({ reportId: report.id, justification: justification.trim(), photoUri: photoUri || undefined });
    setSubmittingDispute(false);
    setShowDispute(false);
    setJustification('');
    setPhotoUri('');
    Alert.alert('Contestação enviada', 'Obrigado por ajudar a manter os relatos confiáveis.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Relato da comunidade" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <StatusPill status={report.status === 'synced' ? report.category : report.status} />
            <View style={styles.communityBadge}>
              <UserRound color={colors.blue} size={14} />
              <Text style={styles.communityText}>Comunidade</Text>
            </View>
          </View>
          <Text style={styles.address}>{report.address}</Text>
          {report.photoUri ? <Image source={{ uri: report.photoUri }} style={styles.reportPhoto} /> : null}
          <View style={styles.metaRow}>
            <MapPin color={colors.muted} size={15} />
            <Text style={styles.metaText}>{report.neighborhood}, Santos - SP</Text>
          </View>
          <View style={styles.metaRow}>
            <Clock3 color={colors.muted} size={15} />
            <Text style={styles.metaText}>Observado em {formatDateTime(report.observedAt)}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>Descrição</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>

        <View style={styles.confirmCard}>
          <View style={styles.confirmIcon}>
            <MessageCircle color={colors.blue} size={22} />
          </View>
          <View style={styles.confirmCopy}>
            <Text style={styles.confirmTitle}>{report.confirmations} pessoas confirmaram</Text>
            <Text style={styles.confirmText}>Você também está vendo esta situação?</Text>
          </View>
        </View>
        <PrimaryButton
          label={confirmed ? 'Ocorrência confirmada' : 'Confirmar ocorrência'}
          onPress={() => confirmReport(report.id)}
          disabled={confirmed}
          variant="secondary"
          icon={confirmed ? <Check color={colors.green} size={18} /> : undefined}
        />

        <Pressable style={styles.disputeLink} onPress={() => setShowDispute((value) => !value)}>
          <Text style={styles.disputeLinkText}>{showDispute ? 'Fechar contestação' : 'Dizer que este relato não é verdade'}</Text>
        </Pressable>

        {showDispute ? (
          <View style={styles.disputeCard}>
            <Text style={styles.disputeTitle}>Contestar relato</Text>
            <Text style={styles.disputeSubtitle}>Conte o que está incorreto. Sua justificativa será analisada pela comunidade.</Text>
            <TextInput
              value={justification}
              onChangeText={setJustification}
              maxLength={500}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Ex.: a via está livre e o relato parece ser de outro momento..."
              placeholderTextColor={colors.muted}
              style={styles.disputeInput}
            />
            <Pressable style={styles.evidenceButton} onPress={pickEvidence}>
              {photoUri ? <Image source={{ uri: photoUri }} style={styles.evidencePhoto} /> : <View style={styles.evidenceIcon}><Camera color={colors.blue} size={20} /></View>}
              <View style={styles.evidenceCopy}>
                <Text style={styles.evidenceTitle}>{photoUri ? 'Trocar foto da evidência' : 'Adicionar foto da evidência'}</Text>
                <Text style={styles.evidenceSubtitle}>Opcional, mas ajuda na análise</Text>
              </View>
            </Pressable>
            <PrimaryButton label="Enviar contestação" onPress={sendDispute} loading={submittingDispute} />
          </View>
        ) : null}

        {isOwner ? (
          <Pressable style={styles.editButton} onPress={() => navigation.navigate('ReportEdit', { reportId: report.id })}>
            <Pencil color={colors.blue} size={18} />
            <Text style={styles.editButtonText}>Editar meu relato</Text>
          </Pressable>
        ) : null}

        <View style={styles.notice}>
          <ShieldAlert color={colors.amber} size={20} />
          <Text style={styles.noticeText}>
            Informação colaborativa não verificada por autoridade. Evite a área se houver risco e ligue 199 em emergências.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl, backgroundColor: colors.canvas },
  card: { padding: spacing.xl, borderRadius: radii.xl, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  communityBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: spacing.sm, paddingVertical: 5, borderRadius: radii.pill, backgroundColor: colors.ice },
  communityText: { ...typography.caption, color: colors.blueDark },
  address: { ...typography.h1, color: colors.ink, marginTop: spacing.xl },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: spacing.sm },
  metaText: { ...typography.small, color: colors.muted },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.xl },
  sectionLabel: { ...typography.caption, color: colors.muted, letterSpacing: 0.6, textTransform: 'uppercase' },
  description: { ...typography.body, color: colors.navySoft, marginTop: spacing.sm },
  reportPhoto: { width: '100%', height: 170, borderRadius: radii.md, marginTop: spacing.lg },
  confirmCard: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  confirmIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ice },
  confirmCopy: { flex: 1, marginLeft: spacing.md },
  confirmTitle: { ...typography.h3, color: colors.ink },
  confirmText: { ...typography.caption, color: colors.muted, marginTop: 2 },
  disputeLink: { alignItems: 'center', paddingVertical: spacing.lg },
  disputeLinkText: { ...typography.small, color: colors.red, fontWeight: '700' },
  disputeCard: { padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#F2CACA' },
  disputeTitle: { ...typography.h3, color: colors.ink },
  disputeSubtitle: { ...typography.small, color: colors.muted, marginTop: spacing.xs },
  disputeInput: { minHeight: 120, padding: spacing.md, marginTop: spacing.lg, borderRadius: radii.md, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line, ...typography.body, color: colors.ink },
  evidenceButton: { minHeight: 70, padding: spacing.sm, marginVertical: spacing.md, flexDirection: 'row', alignItems: 'center', borderRadius: radii.md, backgroundColor: colors.canvas, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E6B5B5' },
  evidenceIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ice },
  evidencePhoto: { width: 48, height: 48, borderRadius: 14 },
  evidenceCopy: { flex: 1, marginLeft: spacing.md },
  evidenceTitle: { ...typography.small, color: colors.blueDark, fontWeight: '700' },
  evidenceSubtitle: { ...typography.caption, color: colors.muted, marginTop: 2 },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.lg, paddingVertical: spacing.md },
  editButtonText: { ...typography.small, color: colors.blue, fontWeight: '700' },
  notice: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.amberSoft },
  noticeText: { ...typography.small, color: '#77500A', flex: 1 },
});
