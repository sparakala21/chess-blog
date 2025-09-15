// src/app/blog/[slug]/page.tsx
import { getPost } from "./_queries/get-post";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
 
  if (!post) {
    notFound();
  }
  
  const PostComponent = post?.content;
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation space */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <a href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Blog
          </a>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Article header */}
          <header className="px-8 py-8 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="space-y-4">
              {post?.title && (
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {post.title}
                </h1>
              )}
              
              {(post?.publishDate || post?.author?.name) && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {post?.publishDate && (
                    <time dateTime={post.publishDate} className="flex items-center gap-1">
                      📅 {new Date(post.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                  {post?.author?.name && (
                    <span className="flex items-center gap-1">
                      ✍️ {post.author.name}
                    </span>
                  )}
                  {post?.lastModified && (
                    <span className="flex items-center gap-1 text-xs">
                      📝 Updated {new Date(post.lastModified).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              )}

              {post?.excerpt && (
                <p className="text-xl text-gray-700 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {post?.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Article content */}
          <div className="px-8 py-8">
            <div className="prose prose-lg prose-gray max-w-none
                          prose-headings:text-gray-900 
                          prose-headings:font-bold
                          prose-p:text-gray-700 
                          prose-p:leading-relaxed
                          prose-a:text-blue-600 
                          prose-a:no-underline 
                          hover:prose-a:underline
                          prose-strong:text-gray-900
                          prose-code:bg-gray-100 
                          prose-code:px-1 
                          prose-code:py-0.5 
                          prose-code:rounded
                          prose-pre:bg-gray-900
                          prose-blockquote:border-blue-200
                          prose-blockquote:bg-blue-50
                          prose-blockquote:py-1
                          prose-img:rounded-lg
                          prose-img:shadow-md">
              <PostComponent />
            </div>
          </div>
        </article>

        {/* Footer/Related posts section */}
        <footer className="mt-12 py-8 border-t">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Thanks for reading! Share your thoughts or feedback.
            </p>
            <div className="mt-4 space-x-4">
              <a href="/blog" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                More Posts
              </a>
              <a href="/contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Get in Touch
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}