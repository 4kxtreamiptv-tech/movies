import { redirect } from 'next/navigation';

// Episode URLs are now slug-only at root: /pilot-s01e01-tmdb-1911-1-1 (no /episode/ prefix)
export default async function EpisodeRedirect({
  params,
}: { 
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
