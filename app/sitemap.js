import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const siteUrl = 'https://www.prepa-fpc.fr'

export default async function sitemap() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, date')
    .eq('published', true)
    .order('date', { ascending: false })

  const articleUrls = (articles || []).map((article) => ({
    url: `${siteUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/tarifs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/calculs-doses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    ...articleUrls,
  ]
}
