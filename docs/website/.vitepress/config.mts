import { defineConfig } from 'vitepress'
import typedocSidebar from '../api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@litert/uuid",
  description: "A uuid generator library for NodeJS.",
  base: '/projects/uuid.js/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Reference', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Snowflake SI', link: '/guides/Snowflake-SI' },
        ]
      },
      {
        text: 'API Reference',
        items: typedocSidebar,
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/litert/uuid.js' }
    ]
  }
})
