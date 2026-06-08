import { defineConfig } from 'vitepress'
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'

export default defineConfig({
  title: 'Docs',
  description: 'API controlled screen capture from sandboxes, containers, and VMs',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }]
  ],
  vite: {
    plugins: [llmstxt()]
  },
  markdown: {
    config(md) {
      md.use(copyOrDownloadAsMarkdownButtons)
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/overview/' },
      { text: 'Open App', link: 'https://frametap.io/app' },
      { text: 'API Reference', link: 'https://api-reference.frametap.io/' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/overview/' },
          { text: 'Quick Start', link: '/overview/quick-start' },
          { text: 'Using the App', link: '/overview/app' }
        ]
      },
      {
        text: 'Installation',
        collapsed: false,
        items: [
          { text: 'Install CLI', link: '/installation/cli' },
          { text: 'Docker Setup', link: '/installation/docker' },
          { text: 'Selenium Integration', link: '/installation/selenium' }
        ]
      },
      {
        text: 'CLI Reference',
        collapsed: false,
        items: [
          { text: 'Commands', link: '/cli/commands' },
          { text: 'Environment Variables', link: '/cli/environment' },
          { text: 'Auto-Record', link: '/cli/auto-record' }
        ]
      },
      {
        text: 'Jobs & Workflows',
        collapsed: false,
        items: [
          { text: 'Job Types', link: '/jobs/types' },
          { text: 'Stop Conditions', link: '/jobs/stop-conditions' },
          { text: 'Watch Folder', link: '/jobs/watch-folder' }
        ]
      },
      {
        text: 'API',
        collapsed: false,
        items: [
          { text: 'API Overview', link: '/api/overview' },
          { text: 'Authentication', link: '/api/authentication' },
          { text: 'API Reference', link: '/reference/api-spec' }
        ]
      },
      {
        text: 'Platform',
        collapsed: false,
        items: [
          { text: 'Runners', link: '/platform/runners' },
          { text: 'Documents', link: '/platform/documents' },
          { text: 'Billing', link: '/platform/billing' }
        ]
      },
      {
        text: 'Reference',
        collapsed: false,
        items: [
          { text: 'API Reference', link: '/reference/api-spec' },
          { text: 'Agent Skill', link: '/llms/skill' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/frametap' }
      // { icon: 'x', link: 'https://x.com/frametap' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Frametap'
    }
  }
})
