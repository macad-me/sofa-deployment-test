import { defineConfig } from 'vitepress';
import { resolve } from 'path';
import { extractHeadings } from './plugins/extractHeadings';

export default defineConfig({
  base: '/',
  title: 'SOFA - by MAOS',
  description: 'A MacAdmins open source project',
  themeConfig: {
    logo: '../images/custom_logo.png',
    search: {
      provider: 'local',  // Default search provider
      options: {
        // Search options can be configured here
      }
    },

    nav: [
      { text: 'Home', link: '/getting-started' },
      { text: '⚡️ Sequoia', link: '/macOS_Sequoia' }, 
      { text: '✨ Sonoma', link: '/macOS_Sonoma' },
      { text: 'Ventura', link: '/macOS_Ventura' },
      { text: 'Monterey', link: '/macOS_Monterey' },
      { text: '✨ iOS 17', link: '/iOS_17' },
      { text: 'iOS 16', link: '/iOS_16' },
      { text: 'Use cases', link: '/use-cases' },
    ],
    sidebar: [
      { text: 'Home', link: '/getting-started' },
      { text: 'Search CVE info', link: '/cve-search' },
      { text: 'Search Model info', link: '/model-identifier' },
      {
        text: 'macOS',
        items: [
          { text: 'Sonoma 14', link: '/macOS_Sonoma' },
          { text: 'Ventura 13', link: '/macOS_Ventura' },
          { text: 'Monterey 12', link: '/macOS_Monterey' },
        ],
      },
      {
        text: 'iOS',
        items: [
          { text: 'iOS 17', link: '/iOS_17' },
          { text: 'iOS 16', link: '/iOS_16' },
        ],
      },
      {
        text: 'Beta versions',
        items: [
          { text: 'macOS Sequoia', link: '/macOS_Sequoia' }
        ],
      },
      {
        text: 'Info',
        items: [
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Contibutors', link: '/team' },
          { text: 'Commmunity', link: '/community' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Examples', link: 'https://github.com/macadmins/sofa/tree/main/tool-scripts#examples' },
          { text: 'Use Cases / Examples', link: '/use-cases' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/macadmins/sofa' },
    ],
    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: 'Copyright © 2024 by MacAdmins Open Source.',
    },
  },
  vite: {
    publicDir: '../public',
    resolve: {
      alias: {
        '@components': resolve(__dirname, '../../web/components'),
        '@cache': resolve(__dirname, '../../cache'),
        '@images': resolve(__dirname, '../../public/images'),
        '@v1': resolve(__dirname, '../../v1'),
      },
    },
    plugins: [
      {
        name: 'vitepress-config-logger',
        configResolved(config) {
          console.log('VitePress Config:', config);
        }
      }
    ]
  },
});
