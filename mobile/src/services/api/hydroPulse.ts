import { reports as mockReports, stations as mockStations } from '../../data/mock';
import type {
  CreateReportInput,
  FloodReport,
  ReportDispute,
  Station,
  SyncPullResponse,
  SyncPushRequest,
  UpdateReportInput,
} from '../../types/domain';
import { apiRequest, USE_MOCKS } from './client';

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export const hydroPulseApi = {
  async listStations(): Promise<Station[]> {
    if (USE_MOCKS) {
      await delay();
      return mockStations;
    }
    return apiRequest<Station[]>('/v1/stations');
  },

  async listReports(params?: { since?: string }): Promise<FloodReport[]> {
    if (USE_MOCKS) {
      await delay();
      return mockReports;
    }
    const query = params?.since ? `?since=${encodeURIComponent(params.since)}` : '';
    return apiRequest<FloodReport[]>(`/v1/reports${query}`);
  },

  async createReport(input: CreateReportInput): Promise<FloodReport> {
    if (USE_MOCKS) {
      await delay(700);
      return {
        ...input,
        id: input.clientId,
        neighborhood: 'Santos',
        createdAt: new Date().toISOString(),
        status: 'synced',
        source: 'community',
        confirmations: 0,
        authorId: input.authorId,
        photoUri: input.photoUri,
      };
    }
    return apiRequest<FloodReport>('/v1/reports', {
      method: 'POST',
      headers: { 'Idempotency-Key': input.clientId },
      body: JSON.stringify(input),
    });
  },

  async updateReport(reportId: string, input: UpdateReportInput): Promise<FloodReport> {
    if (USE_MOCKS) {
      await delay(500);
      return {
        ...input,
        id: reportId,
        clientId: reportId,
        neighborhood: 'Santos',
        createdAt: new Date().toISOString(),
        status: 'synced',
        source: 'community',
        confirmations: 0,
        authorId: 'local-user',
      };
    }
    return apiRequest<FloodReport>(`/v1/reports/${encodeURIComponent(reportId)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  async submitDispute(input: Omit<ReportDispute, 'id' | 'createdAt' | 'status'>): Promise<ReportDispute> {
    if (USE_MOCKS) {
      await delay(500);
      return { ...input, id: `dispute-${Date.now()}`, createdAt: new Date().toISOString(), status: 'sent' };
    }
    return apiRequest<ReportDispute>('/v1/report-disputes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async pullSync(cursor?: string): Promise<SyncPullResponse> {
    const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
    return apiRequest<SyncPullResponse>(`/v1/sync/pull${query}`);
  },

  async pushSync(payload: SyncPushRequest) {
    return apiRequest<{ accepted: string[]; rejected: Array<{ id: string; reason: string }> }>(
      '/v1/sync/push',
      { method: 'POST', body: JSON.stringify(payload) },
    );
  },
};
