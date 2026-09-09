'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, LogIn } from 'lucide-react';

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <nav className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo - Background එක නැති කරලා clean පෙනුමක් ලබා දීමට */}
        <Link href="/" className="flex items-center gap-2 group py-2">
          <div className="h-10 flex items-center overflow-hidden">
            <img 
              src="/images/logo2.png" 
              alt="Illamu.lk Logo" 
              className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply" 
            />
          </div>
        </Link>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3.5">
          
          {/* Post Ad Button */}
          <Link 
            href="/post-ad" 
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-indigo-500/25 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>Post Ad</span>
          </Link>
          
          {userName ? (
            <Link 
              href="/profile" 
              className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-2 rounded-full shadow-sm hover:bg-slate-100 hover:border-slate-300 transition-all group"
              title={userName}
            >
              <Avatar className="w-8 h-8 ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link 
              href="/signin" 
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-indigo-50 text-indigo-900 border border-indigo-100 hover:border-indigo-200 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span>Sign in</span>
            </Link>
          )}

        </div>
      </nav>
    </header>
  );
}