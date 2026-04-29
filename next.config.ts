const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_VERSION === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig);
