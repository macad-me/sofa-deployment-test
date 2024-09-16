---
title: Sequoia 15
platform: macOS
layout: doc
---

# macOS Sequoia 15 <Badge type="warning" text="beta version" />

::: warning BETA VERSION 
This is preliminary information about the latest macOS beta releases.
:::

## Latest info

- Apple Sequoia Preview https://www.apple.com/macos/macos-sequoia-preview/


<script setup>
import BetaInfo from './components/BetaInfo.vue';
import LatestFeatures from './components/LatestFeatures.vue';
import SecurityInfo from './components/SecurityInfo.vue';

const frontmatter = {
  title: 'Sequoia 15',
  platform: 'macOS',
  stage: 'release',
};
</script>


## Beta Information for Sequoia 15
<BetaInfo :title="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />

## Latest Release Info
<LatestFeatures :title="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />

## Essential Apple Resources
<LinksComponent :title="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />

## Security Information
<SecurityInfo :title="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />
