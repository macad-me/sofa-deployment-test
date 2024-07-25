<template>
  <div class="cve-details content">
    <h1>CVE Details</h1>
    <div v-if="cveId" class="external-links">
      <h2>External Links:</h2>
      <ul>
        <li>
          <a :href="cveOrgUrl" target="_blank" rel="noopener noreferrer">View {{ cveId }} on CVE.org</a>
        </li>
        <li>
          <a :href="kevUrl" target="_blank" rel="noopener noreferrer">View {{ cveId }} on KEV (CISA)</a>
        </li>
        <li>
          <a :href="nvdUrl" target="_blank" rel="noopener noreferrer">View {{ cveId }} on NVD (NIST)</a>
        </li>
      </ul>
    </div>
    <div v-if="cveDetails" class="cve-details-context">
      <h2>CVE Details Context Info</h2>
      <p>CVE ID: {{ cveDetails.id }}</p>
      <p>Base Score: {{ cveDetails.baseScore }}</p>
      <p>Exploitability Score: {{ cveDetails.exploitabilityScore }}</p>
      <p>Impact Score: {{ cveDetails.impactScore }}</p>
      <p>Hash: {{ cveDetails.hash }}</p>
    </div>
    <div v-else>
      <p v-if="error">{{ error }}</p>
      <p v-else>Loading data...</p>
      <div class="progress-bar" v-if="progress > 0">
        <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cveId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      cveDetails: null,
      error: null,
      progress: 0,
    };
  },
  computed: {
    cveOrgUrl() {
      return `https://www.cve.org/CVERecord?id=${this.cveId}`;
    },
    kevUrl() {
      return `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${this.cveId}`;
    },
    nvdUrl() {
      return `https://nvd.nist.gov/vuln/detail/${this.cveId}`;
    }
  },
  mounted() {
    this.loadCveDetails();
  },
  methods: {
    async loadCveDetails() {
      try {
        this.error = null;
        const CHUNK_SIZE = 1000; // Number of entries to load at once
        const data = await import('@cache/cve_details_vulncheck.json');
        const totalEntries = data.default.CVE_Details.length;
        let found = false;

        for (let i = 0; i < totalEntries; i += CHUNK_SIZE) {
          const chunk = data.default.CVE_Details.slice(i, i + CHUNK_SIZE);
          const details = chunk.find(detail => detail.id === this.cveId);

          if (details) {
            if (details.error_code) {
              this.cveDetails = {
                id: details.id,
                baseScore: 'No CVSS metric found',
                exploitabilityScore: 'No CVSS metric found',
                impactScore: 'No CVSS metric found',
                hash: details.hash || 'N/A'
              };
            } else {
              this.cveDetails = details;
            }
            found = true;
            break;
          }

          // Update progress
          this.progress = Math.min(((i + CHUNK_SIZE) / totalEntries) * 100, 100);

          // Yield to the event loop to avoid blocking the UI
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (!found) {
          this.cveDetails = {
            id: this.cveId,
            baseScore: 'N/A',
            exploitabilityScore: 'N/A',
            impactScore: 'N/A',
            hash: 'N/A'
          };
        }
      } catch (error) {
        console.error('Error loading CVE details:', error);
        this.error = 'Error loading data';
        this.cveDetails = {
          id: this.cveId,
          baseScore: 'Error loading data',
          exploitabilityScore: 'Error loading data',
          impactScore: 'Error loading data',
          hash: 'Error loading data'
        };
      } finally {
        this.progress = 100; // Ensure progress bar is full when done
      }
    }
  }
};
</script>

<style scoped>
.cve-details {
  margin: 20px 0;
}

.external-links ul {
  list-style-type: none;
  padding: 0;
}

.external-links li {
  margin: 10px 0;
}

.external-links a {
  text-decoration: none;
  color: var(--vp-c-text-link);
}

.external-links a:hover {
  text-decoration: underline;
  color: var(--vp-c-text-link-hover);
}

.cve-details-context {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  background-color: #f3f3f3;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  height: 20px;
  margin-top: 20px;
}

.progress-bar-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.2s;
}
</style>
