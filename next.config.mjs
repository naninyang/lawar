/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/themes',
        destination: '/general/themes',
        permanent: true,
      },
      {
        source: '/arms',
        destination: '/general/arms',
        permanent: true,
      },
      {
        source: '/showdown',
        destination: '/general/showdown',
        permanent: true,
      },
      {
        source: '/base',
        destination: '/general/base',
        permanent: true,
      },
      {
        source: '/drone',
        destination: '/general/drone',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
