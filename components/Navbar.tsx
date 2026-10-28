'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  LogIn,
  UserRound,
  Menu,
  X,
  Home,
  UserCircle,
  Heart,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react'; // මෙය ඉහළට import කරන්න


export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
useEffect(() => {
    const name = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    if (name) setUserName(name);

    if (userId) {
      // Fetch user profile
      fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            if (data.data.avatarUrl) setAvatarUrl(data.data.avatarUrl);
            if (data.data.name) setUserName(data.data.name);
          }
        });

      // Fetch unread count function
      const fetchUnreadCount = () => {
        fetch(`/api/messages/unread-count?userId=${userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setUnreadCount(data.count);
            }
          });
      };

      fetchUnreadCount();

      // 🔄 Window එක Active වන විට හෝ Storage වෙනස් වන විට Count එක නැවත පරීක්ෂා කිරීම
      const handleStorageUpdate = () => {
        fetchUnreadCount();
      };

      window.addEventListener('storage', handleStorageUpdate);
      window.addEventListener('focus', handleStorageUpdate); // Window එකට ආපසු එන විට අලුත් වීම

      return () => {
        window.removeEventListener('storage', handleStorageUpdate);
        window.removeEventListener('focus', handleStorageUpdate);
      };
    }
  }, []);

  // Close menu when navigating
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Illamu.lk home"
          className="flex shrink-0 items-center"
        >
          <img
            src="/images/logo2.png"
            alt="Illamu.lk"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/post-ad"
            className="inline-flex h-8 items-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
          >
            <Plus className="h-[18px] w-[18px]" />
            Post Ad
          </Link>

          {/* ❤️ Wishlist / Saved Items Button */}
          <Link
            href="/profile?tab=wishlist"
            title="Saved Wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shadow-sm"
          >
            <Heart className="h-5 w-5 fill-current" />
          </Link>

          
          <Link
            href="/inbox"
            title="Messages Inbox"
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl sm:rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm relative"
          >
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          {userName ? (
            <Link
              href="/profile"
              title={`Profile: ${userName}`}
              className="group flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 px-1 transition hover:border-indigo-200 hover:bg-indigo-50"
            >
              <Avatar className="h-9 w-9 overflow-hidden">
                <AvatarImage src={avatarUrl || ''} alt={userName} className="object-cover" />
                <AvatarFallback className="bg-indigo-600 text-xs font-bold text-white">
                  {userName.trim().charAt(0).toUpperCase() || (
                    <UserRound className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link
              href="/signin"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/post-ad"
            aria-label="Post an ad"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Post Ad
          </Link>

          {/* Mobile Wishlist Heart Icon */}
          <Link
            href="/profile"
            aria-label="Saved Wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shadow-sm"
          >
            <Heart className="h-4 w-4 fill-current" />
          </Link>

          
          <Link
            href="/inbox"
            title="Messages Inbox"
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl sm:rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm relative"
          >
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out sm:hidden ${
          menuOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'pointer-events-none grid-rows-[0fr] opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Home className="h-5 w-5 text-slate-400" />
                Home
              </Link>

              <Link
                href="/post-ad"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Plus className="h-5 w-5 text-slate-400" />
                Post an item for rent
              </Link>

              {/* Mobile Saved Wishlist Link */}
              <Link
                href="/profile"
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                Saved Wishlist
              </Link>

              {userName ? (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <UserCircle className="h-5 w-5 text-slate-400" />
                  My Profile
                </Link>
              ) : (
                <Link
                  href="/signin"
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <LogIn className="h-5 w-5 text-slate-400" />
                  Sign in / Create account
                </Link>
              )}
            </div>

            {/* Account information */}
            {userName && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <Avatar className="h-10 w-10 overflow-hidden">
                  <AvatarImage src={avatarUrl || ''} alt={userName} className="object-cover" />
                  <AvatarFallback className="bg-indigo-600 font-semibold text-white">
                    {userName.trim().charAt(0).toUpperCase() || (
                      <UserRound className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {userName}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}