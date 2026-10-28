'use client';

import { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ItemChat({ itemId, ownerId }: { itemId: string; ownerId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUserId(localStorage.getItem('userId'));
    }

    // Fetch initial messages
    fetch(`/api/messages/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMessages(data.data);
      });

    // Supabase Realtime Subscription for instant message updates
    const channel = supabase
      .channel(`room-${itemId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `itemId=eq.${itemId}`,
        },
        async (payload) => {
          // Fetch sender details for the new live message
          const res = await fetch(`/api/messages/${itemId}`);
          const data = await res.json();
          if (data.success) setMessages(data.data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      toast.error('Please sign in to chat with the owner!');
      return;
    }
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          senderId: currentUserId,
          receiverId: ownerId,
          content: newMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewMessage('');
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-indigo-600" /> Chat with Owner
      </h3>

      {/* Messages Box */}
      <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-20">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-medium shadow-xs ${
                  isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}>
                  <p>{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.sender?.name || 'User'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}