'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Client side eke witharak localStorage eken data read kirima
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-2 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Logo Eka */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-900 tracking-tight">
          <img src="/images/logo2.png" alt="Illamu.lk Logo" className="w-28 object-contain" />
        </Link>
        {/* <span>Illamu<span className="text-blue-500">.lk</span></span> */}
       

        {/* Buttons Tika / User Profile */}
        <div className="flex items-center gap-4">
          <Link 
            href="/post-ad" 
            className="bg-blue-900 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            + Post Ad
          </Link>
          
          {userName ? (
            <Link href="/profile" className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-800 text-white font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* <span className="font-semibold text-gray-800 text-sm">
                {userName}
              </span> */}
            </Link>
          ) : (
            <Link 
              href="/signin" 
              className="bg-gray-100 text-blue-900 border border-blue-900 px-4 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors shadow-sm"
            >
              Sign in
            </Link>
          )}

          
        </div>
      </div>
    </nav>
  );
}