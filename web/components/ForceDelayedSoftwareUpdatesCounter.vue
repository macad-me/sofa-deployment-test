<template>
    <div>
      <h3>Force Delayed Software Updates</h3>
      <div v-if="releaseDate !== 'Unknown'">
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
  import macOSData from '@v1/macos_data_feed.json'; // JSON data for macOS
  import iOSData from '@v1/ios_data_feed.json'; // JSON data for iOS
  
  export default {
    props: {
      platform: {
        type: String,
        required: true, // Pass the platform, e.g., 'macOS' or 'iOS'
      },
      osVersion: {
        type: String,
        required: true, // Pass the OS version, e.g., 'Sequoia 15' or 'iOS 17'
      },
    },
    data() {
      return {
        releaseDate: 'Unknown', // Default value
      };
    },
    mounted() {
      this.loadOsData();
    },
    methods: {
      loadOsData() {
        try {
          const data = this.platform === 'macOS' ? macOSData : iOSData;
          const osData = data.OSVersions.find((os) => os.OSVersion.includes(this.osVersion));
          
          if (osData && osData.Latest && osData.Latest.ReleaseDate) {
            this.releaseDate = osData.Latest.ReleaseDate;
          } else {
            this.releaseDate = 'Unknown'; // Set to 'Unknown' if release date is missing
          }
        } catch (error) {
          console.error('Error loading OS data:', error);
          this.releaseDate = 'Unknown';
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
  