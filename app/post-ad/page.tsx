import type { Metadata } from 'next';
import PostAdClient from './PostAdClient'; // Client component එක import කරනවා

// 🗂️ මෙතනින් තමයි බ්‍රව්සර් ටැබ් එකේ නම හරියටම දෙන්නේ (Server Side)
export const metadata: Metadata = {
  title: 'Post Your Rental Ad | Illamu.lk',
  description: 'Post your item for rent and start earning today on Illamu.lk.',
};

export default function PostAdPage() {
  // Client component එක මෙතනින් render කරනවා
  return <PostAdClient />;
}