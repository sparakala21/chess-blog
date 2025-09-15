//src/app/blog/page.tsx
import { readdir } from "fs/promises";
import path from "path";
import { Post } from "./[slug]/_queries/get-post";
import Image from "next/image";
import Link from "next/link";

export async function getAllPosts() {
  try {
    const postsPath = path.join(process.cwd(), "src/private/posts");
    
    // Get all MDX files
    const files = (await readdir(postsPath, { withFileTypes: true }))
      .filter((file) => file.isFile() && file.name.endsWith(".mdx"))
      .map((file) => file.name);
    
    // Retrieve metadata from MDX files
    const posts = await Promise.all(
      files.map(async (filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        try {
          // Remove .mdx extension to get slug
          const { metadata } = await import(`@/private/posts/${filename}`);
          return { slug, ...metadata };
        } catch (error) {
          console.warn(`Failed to import metadata for ${filename}:`, error);
          return null;
        }
      }),
    );
    
    // Filter out failed imports and sort posts from newest to oldest
    const validPosts = posts.filter(Boolean);
    validPosts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));
    return validPosts as Post[];
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 animate-slide-in-top">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Latest Insights & Stories
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
              Road To GM
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Follow me as I work to become a Chess Grandmaster
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {posts.map(({
            slug,
            title,
            publishDate,
            tags,
            author,
            excerpt,
            featuredImage,
          }, index) => (
            <Link 
              href={`/blog/${slug}`} 
              key={slug} 
              className={`group block transform transition-all duration-500 hover:-translate-y-2 animate-slide-in-bottom delay-${Math.min(index * 100, 500)}`}
            >
              <article className="h-full bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 group-hover:border-blue-300/50 dark:group-hover:border-blue-500/50">
                {/* Featured Image */}
                {featuredImage && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <Image
                      src={featuredImage}
                      alt={title}
                      fill
                      className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                    />
                    {/* Floating Tags */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="flex flex-wrap gap-2">
                        {tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 text-xs font-semibold bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 rounded-full shadow-lg border border-white/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {tags && tags.length > 2 && (
                          <span className="px-3 py-1.5 text-xs font-semibold bg-blue-500/90 text-white rounded-full shadow-lg">
                            +{tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {title}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed line-clamp-3">
                    {excerpt}
                  </p>
                  
                  {/* Author & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {author?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {author?.name || 'Anonymous'}
                        </p>
                        <time 
                          dateTime={publishDate}
                          className="text-xs text-slate-500 dark:text-slate-400"
                        >
                          {new Date(publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                    
                    {/* Read More Arrow */}
                    <div className="flex items-center text-blue-500 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* All Tags (if no featured image) */}
                {!featuredImage && tags && (
                  <div className="px-6 pb-6">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-700/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-slate-300 dark:text-slate-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
              No posts yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}