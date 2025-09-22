import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  images: {
    remotePatterns:[
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
        port:"",
        pathname:"/detopi9nv/**",
      },
       {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", 
        port: "",
        pathname: "/**", 
      },
    ],
    
  },
};



export default nextConfig;
