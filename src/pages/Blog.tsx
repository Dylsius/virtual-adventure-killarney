import React from 'react';
import { useState, useEffect } from 'react';
import { Calendar, User, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import { loadBlogPosts, BlogPost } from '../utils/contentLoader';

const Blog: React.FC = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await loadBlogPosts();
        setPosts(blogPosts.filter(post => post.published));
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <section className="py-20 bg-white min-h-screen mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Latest Updates
            </h1>
            <p className="text-xl text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Stay up to date with the latest news and announcements
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Loading updates...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No updates yet
              </h3>
              <p className="text-blue-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Check back soon for the latest news and announcements!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.slug} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {post.image && (
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-blue-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{post.author}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {post.title}
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-blue-700 text-lg mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div 
                      className="prose prose-blue max-w-none"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br>') }}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Content Management
                </h3>
                <p className="text-blue-700 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Updates are managed through our content management system. All changes are automatically published to the website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Blog;