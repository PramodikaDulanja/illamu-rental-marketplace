'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, MessageSquare, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function ChatContent() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId');
  const receiverId = searchParams.get('receiverId');

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [receiverDetails, setReceiverDetails] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUserId(localStorage.getItem('userId'));
    }

    if (!itemId) return;

    // Fetch Item details
    fetch(`/api/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItemDetails(data.data);
      });

    // Fetch Receiver details
    if (receiverId) {
      fetch(`/api/users/${receiverId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setReceiverDetails(data.data);
        });
    }

    // Fetch initial messages
    fetch(`/api/messages/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMessages(data.data);
      });

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`chat-room-${itemId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `itemId=eq.${itemId}`,
        },
        async () => {
          const res = await fetch(`/api/messages/${itemId}`);
          const data = await res.json();
          if (data.success) setMessages(data.data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId, receiverId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) {
        toast.error('Please sign in to send messages!');
        return;
        }
        if (!newMessage.trim() || !receiverId || !itemId) return;

        try {
        const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            itemId,
            senderId: currentUserId,
            receiverId,
            content: newMessage,
            }),
        });

        const data = await res.json();
        if (data.success) {
            setNewMessage('');
            // 💬 මෙන්න මෙතැනට අලුත් මැසේජ් එක ක්ෂණිකව UI එකට එකතු කිරීම දමන්න:
            setMessages((prev) => [...prev, data.data]);
        } else {
            toast.error('Failed to send message');
        }
        } catch (err) {
        console.error('Error sending message:', err);
        }
    };

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* Back Link */}
        <div>
          <Link
            href={itemId ? `/items/${itemId}` : '/'}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Item
          </Link>
        </div>

        {/* Chat Box Container */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[75vh]">
          
          {/* Chat Header */}
          <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold overflow-hidden shrink-0">
              {receiverDetails?.avatarUrl ? (
                <img src={receiverDetails.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">{receiverDetails?.name || 'Item Owner'}</h2>
              <p className="text-xs text-indigo-300 truncate">
                Regarding: <span className="font-semibold text-white">{itemDetails?.title || 'Loading item...'}</span>
              </p>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="text-center py-24 text-slate-400 text-xs font-medium space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p>No messages yet. Send a message to start chatting with the owner!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-xs ${
                      isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}