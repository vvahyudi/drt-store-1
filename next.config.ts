// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "placeholder.com",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "5001",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "api.drtstore.com",
				pathname: "/**",
			},
		],
		formats: ["image/avif", "image/webp"],
		// Opsional: Atur ukuran default untuk optimasi
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	// Opsional: Konfigurasikan webpack jika diperlukan
	// webpack(config) {
	//   return config;
	// },
}

export default nextConfig
