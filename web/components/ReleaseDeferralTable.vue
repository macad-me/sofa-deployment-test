<template>
    <div>

  
      <h3>macOS Release Deferral Overview (as of {{ formattedDate }})</h3>
  
      <table>
        <thead>
          <tr>
            <th>OS Version</th>
            <th>Build</th>
            <th>Release Date</th>
            <th>30-Day Deferral</th>
            <th>60-Day Deferral</th>
            <th>90-Day Deferral</th>
            <th>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="release in deferralData" :key="release.version">
            <td>{{ release.version }}</td>
            <td>{{ release.build }}</td>
            <td>{{ release.releaseDate }}</td>
            <td>{{ release.deferred30 }}</td>
            <td>{{ release.deferred60 }}</td>
            <td>{{ release.deferred90 }}</td>
            <td>{{ release.expirationDate }}</td>
          </tr>
        </tbody>
      </table>
  
      <div class="links-info">
        <h4>Info Links</h4>
        <a href="https://support.apple.com/en-us/100100">Apple Security Updates</a>
        <a href="https://support.apple.com/en-gb/guide/deployment/depafd2fad80/web">Deploy software updates to Apple devices</a>
      </div>
    </div>
  </template>
  
  <script>
  import macOSData from '@v1/macos_data_feed.json';
  
  export default {
    data() {
      return {
        baseDate: new Date(),
        deferralData: []
      };
    },
    computed: {
      formattedDate() {
        return this.baseDate.toLocaleDateString();
      }
    },
    methods: {
      calculateDeferralDates(releaseDateStr) {
        const releaseDate = new Date(releaseDateStr);
        return {
          deferred14: this.addDays(releaseDate, 14),
          deferred30: this.addDays(releaseDate, 30),
          deferred60: this.addDays(releaseDate, 60),
          deferred90: this.addDays(releaseDate, 90)
        };
      },
      addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toLocaleDateString();
      },
      processData() {
        this.deferralData = macOSData.OSVersions.map(version => {
          const deferralDates = this.calculateDeferralDates(version.Latest.ReleaseDate);
          return {
            version: version.Latest.ProductVersion,
            build: version.Latest.Build,
            releaseDate: new Date(version.Latest.ReleaseDate).toLocaleDateString(),
            deferred14: deferralDates.deferred14,
            deferred30: deferralDates.deferred30,
            deferred60: deferralDates.deferred60,
            deferred90: deferralDates.deferred90,
            expirationDate: new Date(version.Latest.ExpirationDate).toLocaleDateString()
          };
        });
      }
    },
    created() {
      this.processData();
    }
  };
  </script>
  
  <style scoped>
  .links-info {
    text-align: left;
    margin-bottom: 10px;
  }
  .links-info a {
    display: block;
    margin-bottom: 5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  </style>
  