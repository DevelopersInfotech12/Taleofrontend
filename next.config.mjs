const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "taleobackend.onrender.com" },
    ],
  },
  async rewrites() {
    return [
      { source: "/uploads/:path*", destination: "http://localhost:5000/uploads/:path*" },
    ];
  },
};
export default nextConfig;