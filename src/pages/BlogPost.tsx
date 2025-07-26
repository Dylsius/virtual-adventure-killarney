import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import { loadBlogPosts, BlogPost as BlogPostType } from '../utils/contentLoader';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const blogPosts = await loadBlogPosts();
        const foundPost = blogPosts.find(p => p.slug === slug && p.published);
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBodyContent = (body: string) => {
    // Convert markdown-style formatting to HTML
    return body
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-blue-900 mb-6 mt-8" style="font-family: Montserrat, sans-serif">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-blue-900 mb-4 mt-6" style="font-family: Montserrat, sans-serif">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-blue-900 mb-3 mt-5" style="font-family: Montserrat, sans-serif">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">$1</li>')
      .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc ml-6 mb-4 space-y-2">$1</ul>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed" style="font-family: Montserrat, sans-serif">')
      .replace(/^(.+)$/gm, '<p class="mb-4 leading-relaxed" style="font-family: Montserrat, sans-serif">$1</p>')
      .replace(/<p[^>]*><\/p>/g, ''); // Remove empty paragraphs
  };

  if (loading) {
    return (
      <>
        <section className="bg-white min-h-screen mt-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Loading post...</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <section className="bg-white min-h-screen mt-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Post Not Found
              </h1>
              <p className="text-blue-700 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Blog</span>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="bg-white min-h-screen mt-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog Link */}
          <div className="mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Blog</span>
            </Link>
          </div>

          {/* Blog Post Content */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {post.image && (
              <div className="h-96 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8 lg:p-12">
              {/* Post Meta */}
              <div className="flex items-center space-x-4 text-sm text-blue-600 mb-6">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{post.author}</span>
                </div>
              </div>
              
              {/* Post Title */}
              <h1 className="text-3xl font-bold text-blue-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {post.title}
              </h1>
              
              {/* Post Excerpt */}
              {post.excerpt && (
                <div className="text-xl text-blue-700 mb-8 leading-relaxed border-l-4 border-blue-200 pl-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {post.excerpt}
                </div>
              )}
              
              {/* Post Content */}
              <div 
                className="prose prose-lg prose-blue max-w-none text-gray-700"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                dangerouslySetInnerHTML={{ __html: formatBodyContent(post.body) }}
              />
            </div>
          </article>

          {/* Back to Blog Link (Bottom) */}
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to All Posts</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BlogPost; 