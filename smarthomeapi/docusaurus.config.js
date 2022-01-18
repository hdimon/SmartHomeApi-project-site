// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const math = require('remark-math');
const katex = require('rehype-katex');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'SmartHomeApi',
    tagline: 'Cross-platform plugin-based system for home automation',
    url: 'https://smarthomeapi.netlify.app',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'hdimon', // Usually your GitHub org/user name.
    projectName: 'smarthomeapi', // Usually your repo name.

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    routeBasePath: '/', // Serve the docs at the site's root
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/hdimon/SmartHomeApi-project-site/tree/main/smarthomeapi/',
                    remarkPlugins: [math],
                    rehypePlugins: [katex]
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    stylesheets: [
        {
          href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
          integrity:
            'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
          crossorigin: 'anonymous',
        },
    ],
    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'SmartHomeApi',
                /*logo: {
                    alt: 'My Site Logo',
                    src: 'img/logo.svg',
                },*/
                items: [
                    {
                        type: 'doc',
                        docId: 'documentation',
                        position: 'left',
                        label: 'Documentation',
                    },
                    { to: '/download', label: 'Download', position: 'left' },
                    {
                        href: 'https://github.com/hdimon/SmartHomeApi',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        //title: 'Docs',
                        items: [
                            {
                                label: 'Documentation',
                                to: '/documentation',
                            },
                        ],
                    },
                    {
                        //title: 'Docs',
                        items: [
                            {
                                label: 'Download',
                                to: '/download',
                            },
                        ],
                    },
                    {
                        //title: 'Docs',
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/hdimon/SmartHomeApi',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} SmartHomeApi. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;