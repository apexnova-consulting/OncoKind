import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import {
  COMMUNITY_CATEGORIES,
  buildPublicDisplayName,
  moderateCommunityText,
  toCommunitySlug,
} from '@/lib/community';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please sign in to create a thread.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const categorySlug = typeof body?.categorySlug === 'string' ? body.categorySlug : '';
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const content = typeof body?.body === 'string' ? body.body.trim() : '';

  if (!COMMUNITY_CATEGORIES.some((category) => category.slug === categorySlug)) {
    return NextResponse.json({ error: 'Choose a valid community category.' }, { status: 400 });
  }
  if (title.length < 8 || content.length < 20) {
    return NextResponse.json({ error: 'Please add a clear title and a little more detail.' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, subscription_tier')
    .eq('id', user.id)
    .maybeSingle();

  const canPost =
    profile?.subscription_tier === 'advocate' || profile?.subscription_tier === 'enterprise';

  if (!canPost) {
    return NextResponse.json({ error: 'Posting requires the Advocate Plan.' }, { status: 402 });
  }

  const moderation = moderateCommunityText(`${title}\n${content}`);
  const service = createServiceRoleSupabaseClient();
  const baseSlug = toCommunitySlug(title) || 'community-thread';

  const { count } = await service
    .from('community_threads')
    .select('id', { count: 'exact', head: true })
    .eq('category_slug', categorySlug)
    .ilike('slug', `${baseSlug}%`);

  const slug = count && count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;

  const { data, error } = await service
    .from('community_threads')
    .insert({
      category_slug: categorySlug,
      slug,
      title,
      body: content,
      author_id: user.id,
      author_display_name: buildPublicDisplayName(profile?.full_name, profile?.email ?? user.email),
      moderation_status: moderation.approved ? 'approved' : 'pending',
      is_moderated: moderation.approved,
    })
    .select('id, slug')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Unable to create thread right now.' }, { status: 500 });
  }

  return NextResponse.json({ thread: data });
}
