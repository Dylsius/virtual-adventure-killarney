import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Play } from 'lucide-react';
import Footer from '../components/Footer';
import { loadVideoItems, VideoItem } from '../utils/contentLoader';

const VideoPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoItems = await loadVideoItems();
        const foundVideo = videoItems.find(v => v.slug === slug && v.published);
        
        if (foundVideo) {
          setVideo(foundVideo);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVideo();
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

  if (loading) {
    return (
      <>
        <section className="py-20 bg-white min-h-screen mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Loading video...</p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (notFound || !video) {
    return (
      <>
        <section className="py-20 bg-white min-h-screen mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Play className="h-16 w-16 text-blue-300 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-blue-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Video Not Found
              </h1>
              <p className="text-blue-700 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                The video you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/videos"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Videos</span>
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
      <section className="py-20 bg-white min-h-screen mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Videos Link */}
          <div className="mb-8">
            <Link
              to="/videos"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Videos</span>
            </Link>
          </div>

          {/* Video Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Video Player */}
            <div className="relative bg-black">
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
            
            <div className="p-8 lg:p-12">
              {/* Video Meta */}
              <div className="flex items-center space-x-2 text-sm text-blue-600 mb-6">
                <Calendar className="h-4 w-4" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{formatDate(video.date)}</span>
              </div>
              
              {/* Video Title */}
              <h1 className="text-3xl font-bold text-blue-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {video.title}
              </h1>
              
              {/* Video Description */}
              {video.description && (
                <div className="text-lg text-blue-700 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {video.description}
                </div>
              )}
            </div>
          </div>

          {/* Back to Videos Link (Bottom) */}
          <div className="mt-12 text-center">
            <Link
              to="/videos"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to All Videos</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default VideoPost; 