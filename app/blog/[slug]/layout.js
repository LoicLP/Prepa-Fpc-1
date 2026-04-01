import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function generateMetadata({ params }) {
  const { slug } = await params

  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, date, category, image_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) {
    return { title: 'Article introuvable' }
  }

  const url = `https://www.prepa-fpc.fr/blog/${slug}`

  return {
    title: article.title,
    description: article.excerpt,
    keywords: [article.category, "concours FPC", "concours infirmier", "IFSI", "passerelle infirmier"],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      url,
      siteName: 'Prépa FPC',
      ...(article.image_url && {
        images: [{ url: article.image_url, width: 1200, height: 630, alt: article.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      ...(article.image_url && { images: [article.image_url] }),
    },
    alternates: {
      canonical: url,
    },
  }
}

export default function ArticleLayout({ children }) {
  return children
}
