"use client";
import { useRouter } from 'next/navigation';
import { WEB_APP_NAME } from '@/constants/common';
import { Image } from '@nextui-org/react';

export default function AuthWrapper({ children }) {
  const router = useRouter();  

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Side - Image & Branding */}
          <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-800 p-8 flex flex-col justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <Image src="/logo/default-logo.png" alt="Logo" width={32} height={32} />
              </div>
              <span className="text-white font-bold text-xl">{WEB_APP_NAME}</span>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/20 to-transparent"></div>
              {/* Mountain silhouette simulation */}
              <div className="absolute bottom-0 left-0 w-full h-1/2">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <path
                    d="M0,200 L80,120 L160,80 L240,100 L320,60 L400,90 L400,200 Z"
                    fill="rgba(0,0,0,0.4)"
                  />
                  <path
                    d="M0,200 L60,140 L140,100 L220,120 L300,80 L400,110 L400,200 Z"
                    fill="rgba(0,0,0,0.3)"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-auto">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">WELL COME</h1>
              <h2 className="text-2xl lg:text-3xl font-light text-white/90">TO {WEB_APP_NAME}</h2>
            </div>

            {/* Back to Login */}
            <div className="relative z-10 mt-8">
              <button
                className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                onClick={() => router.push('/')}
              >
                ← Trang chủ
              </button>
            </div>
          </div>

          {/* Right Side - Form */}
          {children}
        </div>
      </div>
    </div>
  );
}
