import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import VideoGallery from './pages/VideoGallery';
import VideoPost from './pages/VideoPost';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import CookiesPopup from './components/CookiesPopup';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <ScrollToTop />
          <Header />
          
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/videos" element={<VideoGallery />} />
              <Route path="/videos/:slug" element={<VideoPost />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            
            <CookiesPopup />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;