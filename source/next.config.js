const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  cleanupOutdatedCaches: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  // HTML/navegação sempre da rede (evita servir página/login em cache velho)
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: { cacheName: 'html-cache', networkTimeoutSeconds: 5 },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}

module.exports = withPWA(nextConfig)
