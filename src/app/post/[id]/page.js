import Link from 'next/link';

async function getPost(id) {
  // Use _embed to get images for SEO tags
  const res = await fetch(`https://www.westshorefurniture.com/wp-json/wp/v2/posts/${id}?_embed`);
  if (!res.ok) return null;
  return res.json();
}

// ✅ NEW: Dynamic SEO Metadata for Google
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return { title: 'Post Not Found' };

  // Strip HTML tags from excerpt for description
  const description = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 160);

  return {
    title: `${post.title.rendered} | West Shore Furniture`,
    description: description,
    openGraph: {
      title: post.title.rendered,
      description: description,
      images: [post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''],
    },
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Post Not Found</h1>
          <Link href="/" className="text-blue-600 mt-4 inline-block hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 font-sans">
      {/* Back Navigation */}
      <Link href="/" className="group text-gray-500 hover:text-blue-600 mb-10 inline-flex items-center transition">
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
        Back to Home
      </Link>

      {/* Article Header */}
      <header className="mb-10">
        <h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex items-center text-gray-400 text-sm uppercase tracking-wider">
          <span>Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      {/* Featured Image (Optional in detail page) */}
      {post._embedded && post._embedded['wp:featuredmedia'] && (
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={post._embedded['wp:featuredmedia'][0].source_url} 
            alt={post.title.rendered}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Content Body */}
      <article 
        className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
      />
    </div>
  );
}