---
title: 18
platform: iOS
---

# iOS/iPadOS 18 <Badge type="tip" text="beta version" />

::: warning BETA VERSION 
This is preliminary information about the latest iOS/iPadOS beta releases.
:::


<script setup>
import LatestFeatures from './components/LatestFeatures.vue';
import SecurityInfo from './components/SecurityInfo.vue';
import ForcedUpdateDeferralIndicator from './components/ForcedUpdateDeferralIndicator.vue'; 
import LinksComponent from './components/LinksComponent.vue';

const frontmatter = {
  title: 'iOS 18',
  platform: 'iOS',
  stage: 'release',
};
</script>

## Latest Release Info
<LatestFeatures :title="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />

## Update Deferral Indicator
<ForcedUpdateDeferralIndicator :osVersion="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />

## Essential Apple Resources
<LinksComponent :title="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />

## Security Information
<SecurityInfo :title="frontmatter.title" :platform="frontmatter.platform" :stage="frontmatter.stage" />
