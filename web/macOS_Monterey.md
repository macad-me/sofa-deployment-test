---
title: Monterey 12
platform: macOS
layout: doc
---

# macOS Monterey 12 <Badge type="danger" text="N-2 version" />
::: danger LIMITED SUPPORT AND SECURITY PATCHES
This version of macOS receives only critical security updates and is not recommended if you are aiming for the most up-to-date OS level security. Consider upgrading to a newer OS version to maintain a stronger security posture.
:::

<script setup>
import LatestFeatures from './components/LatestFeatures.vue';
import SecurityInfo from './components/SecurityInfo.vue';

const frontmatter = {
  title: 'Monterey 12',
  platform: 'macOS'
};
</script>

## Latest Release Info
<LatestFeatures :title="frontmatter.title" :platform="frontmatter.platform" />

## Essential Apple Resources
<LinksComponent :title="frontmatter.title" :platform="frontmatter.platform" />


## Security Information
<SecurityInfo :title="frontmatter.title" :platform="frontmatter.platform" />