// @ts-check

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Lost Last Docs',
  tagline: 'Единая документация frontend и backend',
  url: 'https://vexdillum.github.io',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru']
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'generated-docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js')
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Lost Last Docs',
        items: [
          {to: '/intro', label: 'Документация', position: 'left'},
          {to: '/frontend/', label: 'Frontend', position: 'left'},
          {to: '/backend/', label: 'Backend', position: 'left'},
          {to: '/api/swagger', label: 'Swagger', position: 'left'}
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Разделы',
            items: [
              {label: 'Frontend', to: '/frontend/'},
              {label: 'Backend', to: '/backend/'},
              {label: 'Swagger', to: '/api/swagger'}
            ]
          }
        ],
        copyright: `Lost Last Docs`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
