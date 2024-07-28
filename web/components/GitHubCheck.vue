<template>
    <div>
      <h2>Branch Comparison</h2>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-if="error">{{ error }}</div>
        <div v-else>
          <div>
            <h3>Branch 1: {{ branch1 }}</h3>
            <p>Last commit: {{ branch1Commit.sha }} on {{ new Date(branch1Commit.commit.author.date).toLocaleString() }}</p>
          </div>
          <div>
            <h3>Branch 2: {{ branch2 }}</h3>
            <p>Last commit: {{ branch2Commit.sha }} on {{ new Date(branch2Commit.commit.author.date).toLocaleString() }}</p>
          </div>
          <div>
            <h3>Commits Delta</h3>
            <ul>
              <li v-for="commit in deltaCommits" :key="commit.sha">
                {{ commit.commit.message }} - {{ new Date(commit.commit.author.date).toLocaleString() }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        branch1: 'seed_iOS-18.0_macOS-15.0',
        branch2: 'release',
        repoOwner: 'apple',
        repoName: 'device-management',
        branch1Commit: null,
        branch2Commit: null,
        deltaCommits: [],
        loading: true,
        error: null
      };
    },
    methods: {
      async fetchBranchData() {
        try {
          const branch1Url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?sha=${this.branch1}`;
          const branch2Url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?sha=${this.branch2}`;
  
          const [branch1Response, branch2Response] = await Promise.all([
            fetch(branch1Url).then(response => response.json()),
            fetch(branch2Url).then(response => response.json())
          ]);
  
          this.branch1Commit = branch1Response[0];
          this.branch2Commit = branch2Response[0];
  
          this.fetchDeltaCommits();
        } catch (error) {
          this.error = 'Failed to fetch branch data';
        } finally {
          this.loading = false;
        }
      },
      async fetchDeltaCommits() {
        try {
          const compareUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/compare/${this.branch1}...${this.branch2}`;
          const compareResponse = await fetch(compareUrl).then(response => response.json());
  
          this.deltaCommits = compareResponse.commits;
        } catch (error) {
          this.error = 'Failed to fetch delta commits';
        }
      }
    },
    mounted() {
      this.fetchBranchData();
    }
  };
  </script>
  
  <style scoped>
  h2 {
    color: #333;
  }
  h3 {
    color: #555;
  }
  </style>
  