/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '/Users/loko/eevolvv/talent',
  /**
   * Calmer file watching — rapid saves (format-on-save, multi-file writes) can
   * thrash webpack HMR and take down the dev process on some macOS + monorepo setups.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 750,
        followSymlinks: true,
      };
    }
    return config;
  },
};

export default nextConfig;
