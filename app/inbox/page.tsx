'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, User, ChevronRight } from 'lucide-react';

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Messages Inbox | Illamu.lk';
    if (typeof window !== 'undefined') {
      const currentUserId = localStorage.getItem('userId');
      setUserId(currentUserId);

      if (currentUserId) {
        fetch(`/api/conversations?userId=${currentUserId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setConversations(data.data);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error fetching conversations:', err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Please Sign In</h2>
        <p className="text-slate-500 text-sm mb-6">You need to sign in to view your messages.</p>
        <Link href="/signin" className="bg-indigo-600 text-white px-6 py-3 rounded-full text-xs font-bold shadow-md">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" /> Messages Inbox
          </h1>
          <Link href="/" className="text-xs font-bold text-indigo-600 bg-white px-4 py-2 rounded-full border shadow-sm">
            Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-xs font-medium space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
              <p>No messages or conversations found.</p>
            </div>
          ) : (
            conversations.map((chat, idx) => (
              <Link
                key={idx}
                href={`/chat?itemId=${chat.itemId}&receiverId=${chat.otherUser.id}`}
                className={`flex items-center justify-between p-4 sm:p-5 transition-all group ${
                  chat.hasUnread ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold overflow-hidden shrink-0 shadow-sm">
                      {chat.otherUser.avatarUrl ? (
                        <img src={chat.otherUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{chat.otherUser.name ? chat.otherUser.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}</span>
                      )}
                    </div>
                    {/* 🟢 Unread Green Dot Indicator */}
                    {chat.hasUnread && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm ${chat.hasUnread ? 'font-black text-slate-900' : 'font-bold text-slate-800'} group-hover:text-indigo-600 transition-colors`}>
                        {chat.otherUser.name || 'User'}
                      </h3>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                        {chat.itemTitle}
                      </span>
                    </div>
                    <p className={`text-xs line-clamp-1 ${chat.hasUnread ? 'font-bold text-slate-800' : 'text-slate-500 font-medium'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </main>
  );
}