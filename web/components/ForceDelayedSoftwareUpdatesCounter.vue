<template>
  <div>
    <h3>Force Delayed Software Updates</h3>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="releaseDate !== 'Unknown'">
      <p><strong>Release Date:</strong> {{ formatDate(releaseDate) }}</p>
      <p><strong>90-Day Delay:</strong> {{ delayedDays(90) }}</p>
      <p><strong>60-Day Delay:</strong> {{ delayedDays(60) }}</p>
      <p><strong>30-Day Delay:</strong> {{ delayedDays(30) }}</p>
    </div>
    <div v-else>
      <p>Release date is unknown.</p>
    </div>
  </div>
</template>

<script>
import macOSData from '@v1/macos_data_feed.json';
import iOSData from '@v1/ios_data_feed.json';

export default {
  props: {
    platform: {
      type: String,
      required: true, // Pass 'macOS' or 'iOS'
    },
    osVersion: {
      type: String,
      required: true, // OS version, e.g., 'Sequoia 15'
    },
  },
  data() {
    return {
      releaseDate: 'Unknown',
      loading: true, // Add loading state
    };
  },
  mounted() {
    this.loadOsData();
  },
  methods: {
    loadOsData() {
      try {
        const data = this.platform === 'macOS' ? macOSData : iOSData;
        
        // Log the data loaded from JSON
        console.log("Data loaded:", data);
        console.log("Available OSVersions:", data.OSVersions); // Inspect the OS versions available

        // Ensure that osVersion is logged
        console.log("Searching for osVersion:", this.osVersion);

        // Adjust the search logic for case-insensitive matching
        const osData = data.OSVersions.find(os => os.OSVersion && os.OSVersion.toLowerCase() === this.osVersion.toLowerCase());

        console.log("osData found:", osData); // Log the result

        if (osData && osData.Latest && osData.Latest.ReleaseDate) {
          this.releaseDate = osData.Latest.ReleaseDate;
        } else {
          this.releaseDate = 'Unknown'; // Set to 'Unknown' if release date is missing
        }
      } catch (error) {
        console.error('Error loading OS data:', error);
        this.releaseDate = 'Unknown';
      } finally {
        this.loading = false; // Ensure loading is set to false once data is fetched
      }
    },
    formatDate(dateString) {
      if (dateString === 'Unknown') {
        return 'Unknown';
      }
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    delayedDays(days) {
      if (this.releaseDate === 'Unknown') {
        return 'Unknown';
      }
      const releaseDate = new Date(this.releaseDate);
      const delayedDate = new Date(releaseDate);
      delayedDate.setDate(releaseDate.getDate() + days);

      const currentDate = new Date();
      const timeDiff = delayedDate - currentDate;

      if (timeDiff <= 0) {
        return `Update available (delayed ${days} days ago)`;
      }
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return `${daysLeft} days remaining`;
    },
  },
};
</script>

<style scoped>
div {
  margin-bottom: 10px;
}
p {
  margin: 5px 0;
}
</style>
