/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // or "warn"
  },
};

export default nextConfig;
