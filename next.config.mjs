/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Las fotos las provee el cliente como URLs públicas arbitrarias
    // (Google Drive, hosting propio, etc.). No podemos enumerar los hosts de
    // antemano, así que servimos las imágenes sin optimización de Next en vez
    // de mantener una allowlist de dominios.
    unoptimized: true,
  },
};

export default nextConfig;
