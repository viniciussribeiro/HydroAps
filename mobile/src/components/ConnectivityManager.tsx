import * as Network from 'expo-network';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAppStore } from '../store/useAppStore';

/**
 * Keeps the front-end network state aligned with the device and retries the
 * local operation queue whenever connectivity returns or the app is resumed.
 */
export function ConnectivityManager() {
  const isOnline = useAppStore((state) => state.isOnline);
  const setNetworkAvailable = useAppStore((state) => state.setNetworkAvailable);
  const syncPending = useAppStore((state) => state.syncPending);

  useEffect(() => {
    const updateNetworkState = (state: Network.NetworkState) => {
      const available = state.isConnected === true && state.isInternetReachable !== false;
      setNetworkAvailable(available);
    };

    void Network.getNetworkStateAsync().then(updateNetworkState);
    const subscription = Network.addNetworkStateListener(updateNetworkState);

    return () => subscription.remove();
  }, [setNetworkAvailable]);

  useEffect(() => {
    if (isOnline) void syncPending();
  }, [isOnline, syncPending]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && useAppStore.getState().isOnline) {
        void useAppStore.getState().syncPending();
      }
    });

    return () => subscription.remove();
  }, []);

  return null;
}
