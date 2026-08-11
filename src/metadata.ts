import type { Metadata } from 'next'

const description =
  'Lux runs telecommunications infrastructure — programmable voice, messaging, and phone numbers — and provides satellite internet for sites the ground network does not reach.'

export default {
  metadataBase: new URL('https://lux.tel'),
  title: {
    default: 'Lux Tel — communications, connectivity and agentic AI, as one service',
    template: '%s | Lux Tel',
  },
  description,
  applicationName: 'Lux Tel',
  authors: { name: 'Lux Industries Inc.' },
  keywords:
    'Lux, Lux Tel, telecommunications, programmable voice, voice API, messaging, SMS, phone numbers, satellite internet, satellite connectivity, remote connectivity',
  openGraph: {
    type: 'website',
    url: 'https://lux.tel',
    siteName: 'Lux Tel',
    title: 'Lux Tel — communications, connectivity and agentic AI, as one service',
    description,
  },
  twitter: {
    card: 'summary',
    title: 'Lux Tel — communications, connectivity and agentic AI, as one service',
    description,
    site: '@luxfi',
  },
  /*
    /favicon.ico is a WELL-KNOWN path, not a preference: browsers, bookmark
    stores, feed readers and link unfurlers probe the site root whether or not a
    <link rel="icon"> is declared. Ours lived only under /assets, so the root
    probe fell through to the 404 route and handed back 12KB of HTML pretending
    to be an image. The .ico now sits where the convention looks for it, and is
    declared here too so this list stays the one place icons are named.
  */
  icons: [
    { rel: 'icon', type: 'image/x-icon', sizes: '16x16 32x32', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/assets/lux-site-icons/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/assets/lux-site-icons/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/assets/lux-site-icons/android-chrome-192x192.png' },
    { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/assets/lux-site-icons/android-chrome-512x512.png' },
    { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', url: '/assets/lux-site-icons/apple-touch-icon.png' },
  ],
  formatDetection: { telephone: false },
  other: { 'msapplication-TileColor': '#000000' },
} satisfies Metadata
