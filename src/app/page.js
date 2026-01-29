
import Link from 'next/link';
import Image from 'next/image'; // 👈 引入图片优化引擎

async function getPosts() {
  // Fetch 6 posts with images embedded
  const res = await fetch(
    'https://www.westshorefurniture.com/wp-json/wp/v2/posts?per_page=18&_embed',
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    console.error('API Fetch Error:', res.status, res.statusText);
    throw new Error('Failed to fetch data from West Shore Furniture');
  }

  return res.json();
}

// Forcing a hot reload to refresh the application.
export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="bg-white py-20 text-center border-b px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          West Shore Furniture
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Modern Living & Educational Environments. Experience the headless performance.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow-lg font-medium">
          Browse Collection
        </button>
      </section>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Latest Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
              
              {/* Image Area with Optimization */}
              <div className="h-64 w-full relative group overflow-hidden bg-gray-100">
                {post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url ? (
                  <Image 
                    src={post._embedded['wp:featuredmedia'][0].source_url} 
                    alt={post.title.rendered}
                    fill // ✅ 让图片自动填满容器
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // ✅ SEO 关键：告诉浏览器按需下载
                    className="object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 font-medium">No Image Available</span>
                  </div>
                )}
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 line-clamp-2 leading-tight">
                  {post.title.rendered}
                </h3>
                {/* Excerpt handling */}
                <div 
                  className="text-gray-600 mb-6 line-clamp-3 text-base flex-grow leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                <Link href={`/post/${post.id}`} className="text-blue-600 font-bold hover:text-blue-800 uppercase tracking-wide text-sm mt-auto inline-flex items-center">
                  Read Article 
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
