/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Руководство',
      collapsed: false,
      items: [
        'guide/index',
        'guide/backend',
        'guide/frontend',
        'guide/tg-bot'
      ]
    },
    'contribution/index',
    {
      type: 'category',
      label: 'Архитектура',
      collapsed: false,
      items: [
        'architecture/index',
        'architecture/backend-reference',
        'architecture/frontend',
        'architecture/frontend/components',
        'architecture/frontend/services',
        'architecture/frontend/interfaces',
        'architecture/frontend/routes',
        'architecture/tg-bot'
      ]
    },
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: ['api/swagger']
    }
  ]
};

module.exports = sidebars;
