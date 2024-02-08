/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pixabay.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: '**.pixabay.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'hagerty-media-prod.imgix.net',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'www.carscoops.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'cdn.motor1.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'notoriousluxury.files.wordpress.com',
            port: '',
          }
        ],
      }
}

module.exports = nextConfig
