<template>
  <div class="enforced-software-update-scheduler">
    <!-- Flex container for Button Group and OS Version -->
    <div class="os-version-container">
      <!-- Button Group for Current and Previous Versions -->
      <div class="button-group">
        <button :class="{ active: isCurrent }" @click="selectCurrentVersion">Current</button>
        <button :class="{ active: !isCurrent }" @click="selectPreviousVersion" :disabled="!secondMostRecentVersion">Previous</button>
      </div>

      <!-- OS Version next to the Button Group -->
      <div class="os-version" v-if="selectedVersionDetails">
        <p><strong>Product Version:</strong> {{ selectedVersionDetails.UpdateName || selectedVersionDetails.ProductVersion || 'Unknown' }}</p>
      </div>
    </div>

    <!-- Table Structure for Deferrals -->
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
    };
  },
  mounted() {
    this.loadOsData();
  },
  methods: {
    loadOsData() {
  try {
    console.log("Starting to load data for platform:", this.platform);
    const data = this.platform.toLowerCase() === 'macos' ? macOSData : iOSData;

    console.log("Data loaded from JSON file:", data);
    console.log("OS Version passed as prop:", this.osVersion);

    // If iOS, strip the version down to only numeric, if macOS, leave it as is
    const strippedVersion = this.platform.toLowerCase() === 'ios' ? this.osVersion.replace(/[^0-9]/g, '') : this.osVersion;

    console.log("Stripped/Original OS Version for matching:", strippedVersion);

    // Find the correct OSVersion based on the stripped prop for iOS or full prop for macOS
    const osData = data.OSVersions.find(
      os => os.OSVersion.toLowerCase() === strippedVersion.toLowerCase()
    );

    console.log("Found OSVersion data:", osData);

    if (osData && osData.SecurityReleases) {
      console.log("Security Releases found:", osData.SecurityReleases);

      // Handle cases where there are fewer than 2 security releases
      if (osData.SecurityReleases.length >= 2) {
        const securityReleases = osData.SecurityReleases.slice(0, 2);
        this.latestOSVersion = securityReleases[0];
        this.secondMostRecentVersion = securityReleases[1];
        this.selectedVersionDetails = { ...this.latestOSVersion };

        console.log("Latest OS Version set:", this.latestOSVersion);
        console.log("Second most recent version set:", this.secondMostRecentVersion);
      } else if (osData.SecurityReleases.length === 1) {
        this.latestOSVersion = osData.SecurityReleases[0];
        this.selectedVersionDetails = { ...this.latestOSVersion };
        this.secondMostRecentVersion = null; // No second most recent version

        console.log("Only one security release found:", this.latestOSVersion);
      } else {
        console.error('No SecurityReleases found');
      }
    } else {
      console.error('OSVersion or SecurityReleases not found');
    }
  } catch (error) {
    console.error('Error loading OS data:', error);
  } finally {
    this.loading = false;
  }
},

    selectCurrentVersion() {
      this.isCurrent = true;
      this.selectedVersionDetails = { ...this.latestOSVersion };
      console.log("Selected Current Version:", this.selectedVersionDetails);
    },
    selectPreviousVersion() {
      if (this.secondMostRecentVersion) {
        this.isCurrent = false;
        this.selectedVersionDetails = { ...this.secondMostRecentVersion };
        console.log("Selected Previous Version:", this.selectedVersionDetails);
      }
    },
    formatDate(dateString) {
      // Ensure the date is valid before formatting
      if (!dateString || isNaN(new Date(dateString))) {
        return 'Invalid Date';
      }
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getDeferralStatus(days) {
      if (!this.selectedVersionDetails || !this.selectedVersionDetails.ReleaseDate || isNaN(new Date(this.selectedVersionDetails.ReleaseDate))) {
        return 'Unknown';
      }

      const releaseDate = new Date(this.selectedVersionDetails.ReleaseDate);
      const delayedDate = new Date(releaseDate);
      delayedDate.setDate(releaseDate.getDate() + days);

      const currentDate = new Date();
      const timeDiff = delayedDate - currentDate;

      if (timeDiff < 0) {
        const daysAgo = Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24))); // Exact days difference
        return `Update available since ${daysAgo} days ago`;
      }

      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Ensure rounding up for remaining time
      return `${daysLeft} days remaining until available`;
    },
    calculateDelayedDate(days) {
      if (!this.selectedVersionDetails || !this.selectedVersionDetails.ReleaseDate || isNaN(new Date(this.selectedVersionDetails.ReleaseDate))) {
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
