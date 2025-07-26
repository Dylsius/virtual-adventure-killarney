import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import { loadVideoItems, VideoItem } from '../utils/contentLoader';

const VideoGallery: React.FC = () => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoItems = await loadVideoItems();
        setVideos(videoItems.filter(video => video.published));
      } catch (error) {
        console.error('Error fetching video items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
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
      <section className="bg-white mt-8 mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('videoGalleryTitle')}
            </h1>
            <p className="text-xl text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Watch our VR experiences in action
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <Play className="h-16 w-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No videos yet
              </h3>
              <p className="text-blue-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Check back soon for exciting VR experience videos!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <Link 
                  key={video.slug} 
                  to={`/videos/${video.slug}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
                    <div className="relative">
                      {/* Thumbnail with play overlay */}
                      <div className="aspect-video bg-black relative overflow-hidden">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <Play className="h-16 w-16 text-white" />
                          </div>
                        )}
                        
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-4 transform group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-blue-600 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-blue-600 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{formatDate(video.date)}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {video.title}
                      </h3>
                      
                      {video.description && (
                        <p className="text-blue-700 leading-relaxed mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {video.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-blue-600 group-hover:text-blue-800 transition-colors">
                          <span className="font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Watch Video
                          </span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default VideoGallery;