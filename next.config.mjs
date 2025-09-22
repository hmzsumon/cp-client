// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    additionalData: `$var: red;`,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://cpfx-api-01d22e6d8bdf.herokuapp.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
