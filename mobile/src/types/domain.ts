export type RiskLevel = 'normal' | 'attention' | 'alert';
export type ReportCategory = 'passable' | 'partial' | 'blocked';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type UserAccount = {
  id: string;
  name: string;
  password: string;
  phone: string;
  address: string;
  profilePhotoUri?: string;
  createdAt: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Station = {
  id: string;
  name: string;
  neighborhood: string;
  coordinates: Coordinates;
  rainfallMm: number;
  accumulationPeriodHours: number;
  observedAt: string;
  source: 'CEMADEN' | 'Prefeitura de Santos';
  status: RiskLevel;
};

export type FloodReport = {
  id: string;
  clientId: string;
  category: ReportCategory;
  description: string;
  address: string;
  neighborhood: string;
  coordinates: Coordinates;
  observedAt: string;
  createdAt: string;
  status: SyncStatus;
  source: 'community';
  confirmations: number;
  authorId: string;
  photoUri?: string;
};

export type CreateReportInput = Pick<
  FloodReport,
  'clientId' | 'category' | 'description' | 'address' | 'coordinates' | 'observedAt' | 'authorId'
> & {
  photoUri?: string;
};

export type UpdateReportInput = Pick<
  FloodReport,
  'category' | 'description' | 'address' | 'coordinates' | 'observedAt'
> & {
  photoUri?: string;
};

export type ReportDispute = {
  id: string;
  reportId: string;
  authorId: string;
  justification: string;
  photoUri?: string;
  createdAt: string;
  status: 'sent' | 'pending';
};

export type CitySummary = {
  city: string;
  status: RiskLevel;
  rainfall24hMm: number;
  activeReports: number;
  stationsOnline: number;
  updatedAt: string;
};

export type SyncPullResponse = {
  cursor: string;
  stations: Station[];
  reports: FloodReport[];
  serverTime: string;
};

export type SyncPushRequest = {
  deviceId: string;
  operations: Array<{
    operationId: string;
    type: 'CREATE_REPORT';
    payload: CreateReportInput;
  }>;
};
