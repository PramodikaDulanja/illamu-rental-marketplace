import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ItemDetailsClient from './ItemDetailsClient';

// Supabase සර්වර් ක්ලייන්ට් එක සැකසීම
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    // sublocation සහ location ඩේටා එකත් සමඟ තොරතුරු ලබා ගැනීම
    const { data: item, error } = await supabase
      .from('items')
      .select('title, description, sublocation, location')
      .eq('id', id)
      .single();

    if (!error && item) {
      const itemLocation = item.sublocation || item.location || 'Sri Lanka';
      return {
        title: `${item.title} in ${itemLocation} | Illamu.lk`,
        description: item.description ? item.description.substring(0, 150) : 'Rent items securely on Illamu.lk',
      };
    }
  } catch (err) {
    console.error('Error generating metadata from Supabase:', err);
  }

  return {
    title: 'Item Details | Illamu.lk',
    description: "Sri Lanka's Premier Rental Marketplace",
  };
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Client Component එකට ID එක යැවීම
  return <ItemDetailsClient id={resolvedParams.id} />;
}