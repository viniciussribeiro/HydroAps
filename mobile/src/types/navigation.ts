import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Inicio: undefined;
  Mapa: undefined;
  Relatar: undefined;
  Atividade: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  StationDetail: { stationId: string };
  ReportDetail: { reportId: string };
  ReportEdit: { reportId: string };
  ReportSuccess: { reportId: string; pending: boolean };
  Notifications: undefined;
  ProfileEdit: undefined;
  ProfileSection: { section: 'location' | 'sources' | 'privacy' | 'help' };
};
