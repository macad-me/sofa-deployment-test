<template>
  <div class="model-identifier-table">
    <h2>Model Identifiers</h2>
    <div class="controls">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by model, identifier, or description..." 
        @input="onSearch" 
        class="search-input"
      />
      <button @click="exportAsCSV" class="export-button">Export as CSV</button>
    </div>
    <div v-if="loading">Loading data...</div>
    <div v-else>
      <div v-if="filteredGroupedData.length">
        <div v-for="(osData, index) in filteredGroupedData" :key="index" class="os-version-card">
          <h3>
            <a :href="osData.url" target="_blank">macOS {{ osData.osVersion }}</a>
          </h3>
          <ul>
            <li v-for="entry in osData.entries" :key="entry.identifier">
              <strong>{{ entry.model }}</strong> - {{ entry.identifier }} - {{ entry.description }} - <a :href="entry.url" target="_blank">{{ entry.url }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>No data available.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      groupedData: [],
      filteredGroupedData: [],
      loading: true,
      searchQuery: '',
    };
  },
  async mounted() {
    console.log("Component mounted");
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        console.log("Loading data...");
        const sonomaData = await import('@cache/model_identifier_sonoma.json');
        const montereyData = await import('@cache/model_identifier_monterey.json');
        const venturaData = await import('@cache/model_identifier_ventura.json');
        const sequoiaData = await import('@cache/model_identifier_sequoia.json');
        const supportedDevicesData = await import('@cache/supported_devices.json');

        console.log('Sonoma Data:', sonomaData.default);
        console.log('Monterey Data:', montereyData.default);
        console.log('Ventura Data:', venturaData.default);
        console.log('Sequoia Data:', sequoiaData.default);
        console.log('Supported Devices Data:', supportedDevicesData.default);

        const combinedData = [
          ...this.extractData(sonomaData.default, 'Sonoma 14'),
          ...this.extractData(montereyData.default, 'Monterey 12'),
          ...this.extractData(venturaData.default, 'Ventura 13'),
          ...this.extractData(sequoiaData.default, 'Sequoia 15'),
          ...this.extractSupportedDevices(supportedDevicesData.default)
        ];

        console.log('Combined Data:', combinedData);

        this.tableData = combinedData;
        this.groupedData = this.groupByOsVersion(combinedData);
        this.filteredGroupedData = this.groupedData;

        console.log('Final Table Data:', this.tableData);
        console.log('Grouped Data:', this.groupedData);

        this.loading = false; // Data loading completed
      } catch (error) {
        console.error('Error loading data:', error);
        this.loading = false; // Set loading to false even if there's an error
      }
    },
    extractData(modelData, osVersion) {
      console.log('Extracting data from:', modelData);

      return modelData.flatMap(item => {
        const entries = Object.entries(item.Identifiers).map(([identifier, description]) => ({
          model: item.Model,
          identifier,
          description,
          url: item.URL,
          osVersion,
        }));
        console.log(`Extracted ${entries.length} entries from ${item.Model}`);
        return entries;
      });
    },
    extractSupportedDevices(data) {
      console.log('Extracting supported devices data:', data);
      return data.flatMap(item => {
        const entries = item.SupportedDevices.map(device => ({
          model: device,
          identifier: device,
          description: 'Supported Device',
          url: '',
          osVersion: item.OSVersion,
          osUrl: item.url
        }));
        console.log(`Extracted ${entries.length} entries for OS version ${item.OSVersion}`);
        return entries;
      });
    },
    groupByOsVersion(data) {
      const grouped = data.reduce((acc, entry) => {
        const found = acc.find(group => group.osVersion === entry.osVersion);
        if (found) {
          found.entries.push(entry);
        } else {
          acc.push({ osVersion: entry.osVersion, entries: [entry], url: entry.osUrl });
        }
        return acc;
      }, []);

      // Sort groups by OS version in descending order
      return grouped.sort((a, b) => {
        const osOrder = { 'Sequoia 15': 1, 'Sonoma 14': 2, 'Ventura 13': 3, 'Monterey 12': 4 };
        return osOrder[a.osVersion] - osOrder[b.osVersion];
      });
    },
    onSearch() {
      if (this.searchQuery.trim() === '') {
        this.filteredGroupedData = this.groupedData;
        return;
      }

      const query = this.searchQuery.toLowerCase();
      const filtered = this.groupedData.map(group => {
        const filteredEntries = group.entries.filter(entry =>
          entry.model.toLowerCase().includes(query) ||
          entry.identifier.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query)
        );
        return { ...group, entries: filteredEntries };
      }).filter(group => group.entries.length > 0);

      this.filteredGroupedData = filtered;
    },
    getOSDetailsLink(osVersion) {
      const osLinks = {
        'Sequoia 15': '/sofa-extended/macOS_Sequoia.html',
        'Sonoma 14': '/sofa-extended/macOS_Sonoma.html',
        'Ventura 13': '/sofa-extended/macOS_Ventura.html',
        'Monterey 12': '/sofa-extended/macOS_Monterey.html',
      };
      return osLinks[osVersion] || '#';
    },
    exportAsCSV() {
      const csvContent = this.convertToCSV(this.filteredGroupedData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'model_identifiers.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    convertToCSV(data) {
      const header = 'Model,Identifier,Description,URL,OS Version\n';
      const rows = data.flatMap(group =>
        group.entries.map(entry =>
          `"${entry.model.replace(/"/g, '""')}","${entry.identifier.replace(/"/g, '""')}","${entry.description.replace(/"/g, '""')}","${entry.url.replace(/"/g, '""')}","macOS ${entry.osVersion.replace(/"/g, '""')}"`
        )
      );
      return header + rows.join('\n');
    },
  },
};
</script>

<style scoped>
.model-identifier-table {
  margin: 20px;
}
.controls {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.search-input {
  flex-grow: 1;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #5672cd;
  margin-right: 10px;
}
.export-button {
  padding: 8px 16px;
  font-size: 16px;
  border: 1px solid #5672cd;
  border-radius: 4px;
  background-color: #5672cd;
  color: white;
  cursor: pointer;
}
.export-button:hover {
  background-color: #405aad;
  border-color: #405aad;
}
.os-version-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}
.os-version-card h3 {
  margin-top: 0;
}
.os-version-card ul {
  list-style-type: none;
  padding: 0;
}
.os-version-card ul li {
  padding: 8px 0;
}
.os-version-card ul li a {
  color: #5672cd;
  text-decoration: none;
}
.os-version-card ul li a:hover {
  text-decoration: underline;
}
</style>
