import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { reports as initialReports } from '../data/mock';
import { hydroPulseApi } from '../services/api/hydroPulse';
import type {
  CreateReportInput,
  FloodReport,
  ReportDispute,
  UpdateReportInput,
  UserAccount,
} from '../types/domain';

type AppState = {
  isOnline: boolean;
  networkAvailable: boolean;
  simulateOffline: boolean;
  reports: FloodReport[];
  disputes: ReportDispute[];
  confirmedReportIds: string[];
  user: UserAccount | null;
  accounts: UserAccount[];
  pendingCount: number;
  setNetworkAvailable: (available: boolean) => void;
  setSimulateOffline: (enabled: boolean) => void;
  register: (input: Omit<UserAccount, 'id' | 'createdAt'>) => boolean;
  updateProfile: (input: Pick<UserAccount, 'name' | 'phone' | 'address' | 'profilePhotoUri'>) => boolean;
  login: (name: string, password: string) => boolean;
  logout: () => void;
  createReport: (input: Omit<CreateReportInput, 'clientId' | 'authorId'>) => Promise<FloodReport>;
  updateReport: (reportId: string, input: UpdateReportInput) => Promise<FloodReport | null>;
  confirmReport: (reportId: string) => void;
  submitDispute: (input: Omit<ReportDispute, 'id' | 'authorId' | 'createdAt' | 'status'>) => Promise<ReportDispute>;
  syncPending: () => Promise<void>;
};

const countPending = (reports: FloodReport[]) =>
  reports.filter((report) => report.status === 'pending' || report.status === 'failed').length;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      networkAvailable: true,
      simulateOffline: false,
      reports: initialReports,
      disputes: [],
      confirmedReportIds: [],
      user: null,
      accounts: [],
      pendingCount: 0,
      setNetworkAvailable: (networkAvailable) =>
        set((state) => ({
          networkAvailable,
          isOnline: networkAvailable && !state.simulateOffline,
        })),
      setSimulateOffline: (simulateOffline) =>
        set((state) => ({
          simulateOffline,
          isOnline: state.networkAvailable && !simulateOffline,
        })),
      register: (input) => {
        const alreadyExists = get().accounts.some(
          (account) => account.name.trim().toLocaleLowerCase() === input.name.trim().toLocaleLowerCase(),
        );
        if (alreadyExists) return false;
        const account: UserAccount = {
          ...input,
          id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: input.name.trim(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ accounts: [...state.accounts, account], user: account }));
        return true;
      },
      updateProfile: (input) => {
        const currentUser = get().user;
        if (!currentUser) return false;

        const alreadyExists = get().accounts.some(
          (account) =>
            account.id !== currentUser.id &&
            account.name.trim().toLocaleLowerCase() === input.name.trim().toLocaleLowerCase(),
        );
        if (alreadyExists) return false;

        const updatedUser: UserAccount = {
          ...currentUser,
          ...input,
          name: input.name.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          profilePhotoUri: input.profilePhotoUri || undefined,
        };
        set((state) => ({
          user: updatedUser,
          accounts: state.accounts.map((account) =>
            account.id === currentUser.id ? updatedUser : account,
          ),
        }));
        return true;
      },
      login: (name, password) => {
        const account = get().accounts.find(
          (item) => item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase() && item.password === password,
        );
        if (!account) return false;
        set({ user: account });
        return true;
      },
      logout: () => set({ user: null }),
      createReport: async (input) => {
        const clientId = `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const authorId = get().user?.id ?? 'anonymous';
        const optimistic: FloodReport = {
          ...input,
          id: clientId,
          clientId,
          authorId,
          neighborhood: 'Santos',
          createdAt: new Date().toISOString(),
          status: get().isOnline ? 'syncing' : 'pending',
          source: 'community',
          confirmations: 0,
        };
        const withOptimistic = [optimistic, ...get().reports];
        set({ reports: withOptimistic, pendingCount: countPending(withOptimistic) });

        if (!get().isOnline) return optimistic;

        try {
          const saved = await hydroPulseApi.createReport({ ...input, clientId, authorId });
          const next = get().reports.map((item) => (item.clientId === clientId ? saved : item));
          set({ reports: next, pendingCount: countPending(next) });
          return saved;
        } catch {
          const next = get().reports.map((item) =>
            item.clientId === clientId ? { ...item, status: 'failed' as const } : item,
          );
          set({ reports: next, pendingCount: countPending(next) });
          return { ...optimistic, status: 'failed' };
        }
      },
      updateReport: async (reportId, input) => {
        const current = get().reports.find((report) => report.id === reportId);
        if (!current || current.authorId !== get().user?.id) return null;
        const optimistic = { ...current, ...input };
        set((state) => ({ reports: state.reports.map((item) => (item.id === reportId ? optimistic : item)) }));
        if (!get().isOnline) return optimistic;
        try {
          const saved = await hydroPulseApi.updateReport(reportId, input);
          const updated = { ...saved, authorId: current.authorId, confirmations: current.confirmations };
          set((state) => ({ reports: state.reports.map((item) => (item.id === reportId ? updated : item)) }));
          return updated;
        } catch {
          return optimistic;
        }
      },
      confirmReport: (reportId) => {
        if (get().confirmedReportIds.includes(reportId)) return;
        set((state) => ({
          confirmedReportIds: [...state.confirmedReportIds, reportId],
          reports: state.reports.map((report) =>
            report.id === reportId ? { ...report, confirmations: report.confirmations + 1 } : report,
          ),
        }));
      },
      submitDispute: async (input) => {
        const authorId = get().user?.id;
        if (!authorId) throw new Error('É necessário estar autenticado para contestar um relato.');
        const local: ReportDispute = {
          ...input,
          id: `dispute-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          authorId,
          createdAt: new Date().toISOString(),
          status: get().isOnline ? 'sent' : 'pending',
        };
        set((state) => ({ disputes: [local, ...state.disputes] }));
        if (get().isOnline) {
          try {
            const saved = await hydroPulseApi.submitDispute(inputWithAuthor(input, authorId));
            set((state) => ({ disputes: state.disputes.map((item) => (item.id === local.id ? saved : item)) }));
            return saved;
          } catch {
            return local;
          }
        }
        return local;
      },
      syncPending: async () => {
        if (!get().isOnline) return;
        const pending = get().reports.filter(
          (report) => report.status === 'pending' || report.status === 'failed',
        );

        for (const report of pending) {
          set((state) => ({
            reports: state.reports.map((item) =>
              item.clientId === report.clientId ? { ...item, status: 'syncing' } : item,
            ),
          }));
          try {
            const saved = await hydroPulseApi.createReport({
              clientId: report.clientId,
              category: report.category,
              description: report.description,
              address: report.address,
              coordinates: report.coordinates,
              observedAt: report.observedAt,
              authorId: report.authorId,
              photoUri: report.photoUri,
            });
            set((state) => {
              const reports = state.reports.map((item) =>
                item.clientId === report.clientId ? saved : item,
              );
              return { reports, pendingCount: countPending(reports) };
            });
          } catch {
            set((state) => ({
              reports: state.reports.map((item) =>
                item.clientId === report.clientId ? { ...item, status: 'failed' } : item,
              ),
            }));
          }
        }
      },
    }),
    {
      name: 'hydro-pulse-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        reports: state.reports,
        pendingCount: state.pendingCount,
        disputes: state.disputes,
        confirmedReportIds: state.confirmedReportIds,
        user: state.user,
        accounts: state.accounts,
      }),
    },
  ),
);

const inputWithAuthor = (
  input: Omit<ReportDispute, 'id' | 'authorId' | 'createdAt' | 'status'>,
  authorId: string,
) => ({ ...input, authorId });
