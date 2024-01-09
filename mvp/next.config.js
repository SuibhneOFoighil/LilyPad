/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },
  // env: {
  //   SUPABASE_URL: process.env.SUPABASE_URL,
  //   SUPABASE_KEY: process.env.SUPABASE_KEY,
  // },
}

module.exports = nextConfig
