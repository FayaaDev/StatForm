// Network monitoring service
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export class NetworkService {
  private listeners: Array<(isConnected: boolean) => void> = [];
  private isConnected: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    // Subscribe to network state updates
    NetInfo.addEventListener((state: NetInfoState) => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected ?? false;

      // Notify listeners if connection status changed
      if (wasConnected !== this.isConnected) {
        this.notifyListeners();
      }
    });

    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      this.isConnected = state.isConnected ?? false;
      this.notifyListeners();
    });
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.isConnected));
  }

  // Add listener for network changes
  addListener(listener: (isConnected: boolean) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Check if currently connected
  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this.isConnected = state.isConnected ?? false;
    return this.isConnected;
  }

  // Get current connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const networkService = new NetworkService();

