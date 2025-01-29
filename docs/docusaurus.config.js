// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'F1 Api',
  tagline: 'F1 is cool, This API is for F1 fans. Technologies used: JavaScript, GraphQL, gRPC, Swagger UI. It has every endpoint your app could need. Use for free and enjoy!',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://localhost/8989',
  baseUrl: '/',
  trailingSlash: false,

  customFields: {
    description: 'This API provides all the endpoints your app could need. Use for free and enjoy!',
    technologies: ['JavaScript', 'GraphQL', 'gRPC', 'Swagger UI'],
  },

  themeConfig: {
    navbar: {
      title: 'F1 API Docs',
      logo: {
        alt: 'F1 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/', // Główny link do dokumentacji
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'docs/description', // Link do opisu
          label: 'Description',
          position: 'left',
        },
        {
          to: 'docs/technologies', // Link do technologii
          label: 'Technologies',
          position: 'left',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/kubakniec/f1-Api',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'F1 API',
          items: [
            {
              label: 'Swagger UI',
              to: '/docs', // Link do Swagger UI
            },
            {
              label: 'API Documentation',
              to: '/docs/intro', // Link do głównej dokumentacji
            },
          ],
        },
      ],
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
}

export default config;
