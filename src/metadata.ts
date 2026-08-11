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
  icons: [
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/assets/lux-site-icons/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/assets/lux-site-icons/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/assets/lux-site-icons/android-chrome-192x192.png' },
    { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/assets/lux-site-icons/android-chrome-512x512.png' },
    { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', url: '/assets/lux-site-icons/apple-touch-icon.png' },
  ],
  formatDetection: { telephone: false },
  other: { 'msapplication-TileColor': '#000000' },
} satisfies Metadata
