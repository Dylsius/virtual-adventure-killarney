import React from 'react';
import { useState, useEffect } from 'react';
import { Play, Calendar } from 'lucide-react';
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

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert Vimeo URLs to embed format
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    // Return original URL for direct video files
    return url;
  };

  return (
    <>
      <section className="bg-white min-h-screen mt-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div key={video.slug} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    {video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be') || video.video_url.includes('vimeo.com') ? (
                      <div className="aspect-video">
                        <iframe
                          src={getVideoEmbedUrl(video.video_url)}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-black">
                        <video
                          controls
                          className="w-full h-full object-cover"
                          poster={video.thumbnail}
                        >
                          <source src={video.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-blue-600 mb-3">
                      <Calendar className="h-4 w-4" />
                      <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{formatDate(video.date)}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-blue-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {video.title}
                    </h3>
                    
                    {video.description && (
                      <p className="text-blue-700 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
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