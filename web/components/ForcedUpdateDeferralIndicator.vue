<template>
  <div class="enforced-software-update-scheduler">
    <div class="os-version-container">
      <div class="button-group">
        <button :class="{ active: isCurrent }" @click="selectCurrentVersion">Current</button>
        <button :class="{ active: !isCurrent }" @click="selectPreviousVersion" :disabled="!secondMostRecentVersion">Previous</button>
      </div>

      <div class="os-version" v-if="selectedVersionDetails">
        <p><strong>Product Version:</strong> {{ selectedVersionDetails.UpdateName || selectedVersionDetails.ProductVersion || 'Unknown' }}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Software Update Deferral</th>
          <th>Status</th>
          <th>Date When Available</th>
        </tr>
      </thead>
      <tbody v-if="!loading && selectedVersionDetails">
        <tr>
          <td>90-Day Deferral</td>
          <td>{{ getDeferralStatus(90) }}</td>
          <td>{{ calculateDelayedDate(90) }}</td>
        </tr>
        <tr>
          <td>60-Day Deferral</td>
          <td>{{ getDeferralStatus(60) }}</td>
          <td>{{ calculateDelayedDate(60) }}</td>
        </tr>
        <tr>
          <td>30-Day Deferral</td>
          <td>{{ getDeferralStatus(30) }}</td>
          <td>{{ calculateDelayedDate(30) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>


<script>
import macOSData from '@v1/macos_data_feed.json';
import iOSData from '@v1/ios_data_feed.json';

export default {
  props: {
    platform: {
      type: String,
      required: true, // 'macOS' or 'iOS'
    },
    osVersion: {
      type: String,
      required: true, // e.g., 'Sequoia 15' or 'iOS 18'
    },
  },
  data() {
    return {
      latestOSVersion: {},
      secondMostRecentVersion: null,
      isCurrent: true,
      selectedVersionDetails: {},
      loading: true,
      errorMessage: '', // Store error message for user feedback
    };
  },
  mounted() {
    this.loadOsData();
  },
  methods: {
    loadOsData() {
      try {
        const data = this.platform.toLowerCase() === 'macos' ? macOSData : iOSData;

        // If iOS, strip the version down to only numeric, if macOS, leave it as is
        const strippedVersion = this.platform.toLowerCase() === 'ios'
          ? this.osVersion.replace(/[^0-9]/g, '')
          : this.osVersion;

        // Find the correct OSVersion based on stripped prop for iOS or full prop for macOS
        const osData = data.OSVersions.find(
          os => os.OSVersion.toLowerCase() === strippedVersion.toLowerCase()
        );

        if (!osData) {
          throw new Error('OSVersion not found in data');
        }

        if (osData.SecurityReleases && osData.SecurityReleases.length > 0) {
          this.setupVersions(osData.SecurityReleases);
        } else {
          throw new Error('No Security Releases found for this OSVersion');
        }
      } catch (error) {
        this.errorMessage = `Failed to load data: ${error.message}`;
        console.error('Error loading OS data:', error);
      } finally {
        this.loading = false;
      }
    },
    setupVersions(securityReleases) {
      // Helper method to set latest and second latest versions
      if (securityReleases.length >= 2) {
        this.latestOSVersion = securityReleases[0];
        this.secondMostRecentVersion = securityReleases[1];
      } else {
        this.latestOSVersion = securityReleases[0];
        this.secondMostRecentVersion = null;
      }
      this.selectedVersionDetails = this.latestOSVersion;
    },
    selectCurrentVersion() {
      this.isCurrent = true;
      this.selectedVersionDetails = this.latestOSVersion;
    },
    selectPreviousVersion() {
      if (this.secondMostRecentVersion) {
        this.isCurrent = false;
        this.selectedVersionDetails = this.secondMostRecentVersion;
      }
    },
    formatDate(dateString) {
      if (!dateString || isNaN(new Date(dateString))) {
        return 'Invalid Date';
      }
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getDeferralStatus(days) {
      if (!this.selectedVersionDetails?.ReleaseDate || isNaN(new Date(this.selectedVersionDetails.ReleaseDate))) {
        return 'Unknown';
      }

      const releaseDate = new Date(this.selectedVersionDetails.ReleaseDate);
      const delayedDate = new Date(releaseDate);
      delayedDate.setDate(releaseDate.getDate() + days);

      const currentDate = new Date();
      const timeDiff = delayedDate - currentDate;

      if (timeDiff < 0) {
        const daysAgo = Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24)));
        return `Update available since ${daysAgo} days ago`;
      }

      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return `${daysLeft} days remaining until available`;
    },
    calculateDelayedDate(days) {
      if (!this.selectedVersionDetails?.ReleaseDate || isNaN(new Date(this.selectedVersionDetails.ReleaseDate))) {
        return 'Invalid Date';
      }

      const releaseDate = new Date(this.selectedVersionDetails.ReleaseDate);
      releaseDate.setDate(releaseDate.getDate() + days);
      return this.formatDate(releaseDate.toISOString());
    },
  },
};
</script>


<style scoped>
/* Flex container to place button group and OS Version inline */
.os-version-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* Button Group Style - Smaller and Compact */
.button-group {
  display: inline-flex;
  border: 1px solid var(--vp-c-default-3); /* Slightly darker for contrast */
  border-radius: 4px;
  overflow: hidden;
  margin-right: 15px;
}

.button-group button {
  flex: 1;
  padding: 4px 10px; /* Adjusted padding for balance */
  background-color: var(--vp-c-default-soft); /* Use default soft background color */
  color: var(--vp-c-text-1); /* Main text color */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 12px; /* Adjusted font size for readability */
  font-weight: bold;
}

.button-group button:hover {
  background-color: var(--vp-c-default-2); /* Slightly darker hover state */
}

.button-group button.active {
  background-color: var(--vp-c-brand-2); /* Use a more neutral contrast active state */
  color: white; /* Ensure text is readable */
}

.button-group button:disabled {
  background-color: #f5f5f5; /* Lighter disabled state */
  color: #bbb; /* Dimmed text for disabled state */
  cursor: not-allowed;
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid var(--vp-c-default-3); /* Table border color matching */
  padding: 8px;
  text-align: left;
  color: var(--vp-c-text-1); /* Ensure readability */
}

.links-info {
  text-align: left;
  margin-bottom: 10px;
}

.links-info a {
  display: block;
  margin-bottom: 5px;
}
</style>
