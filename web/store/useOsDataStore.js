import { defineStore } from 'pinia';
import macOSData from '@v1/macos_data_feed.json';
import iOSData from '@v1/ios_data_feed.json';

export const useOsDataStore = defineStore('osData', {
  state: () => ({
    macOSData: null,
    iOSData: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    async loadOsData(forceReload = false) {
      if (this.macOSData && this.iOSData && !forceReload) {
        // Data is already loaded, no need to reload unless forced
        console.log('Data already loaded, skipping reload.');
        return;
      }

      try {
        this.isLoading = true;

        // Simulate async data loading (e.g., could be a fetch request)
        this.macOSData = macOSData;
        this.iOSData = iOSData;

        // Log the data after loading it
        console.log('macOSData loaded:', this.macOSData);
        console.log('iOSData loaded:', this.iOSData);

        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.error = 'Failed to load OS data';
        console.error('Error loading OS data:', error);
      }
    },
  },
});
