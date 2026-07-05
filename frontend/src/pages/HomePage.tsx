import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Ticket, LogOut } from 'lucide-react'; // <-- Menambahkan icon Ticket dan LogOut
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png'; 
import promo1 from '../assets/promo1.jpg';
import promo2 from '../assets/promo2.jpg';
import promo3 from '../assets/promo3.jpg';
import promo4 from '../assets/promo4.jpg';
import promo5 from '../assets/promo5.jpg';
import promo6 from '../assets/promo6.jpg';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  description: string;
  posterUrl: string;
}

export default function HomePage() {
  const navigate = useNavigate(); 
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // 1. STATE UNTUK MENGECEK STATUS LOGIN
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // STATE BARU UNTUK MENAMPILKAN MODAL KONFIRMASI
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fungsi saat tombol "Logout" di navbar diklik (Hanya memunculkan pop-up)
  const triggerLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Fungsi yang BENAR-BENAR menghapus sesi login
  const confirmLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false); 
    setShowLogoutConfirm(false); // Tutup pop-up
    navigate('/'); 
  };

  // Fungsi untuk Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus kunci akses
    setIsLoggedIn(false); // Ubah status menjadi belum login
    navigate('/'); // Refresh ke beranda
  };

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleNextPromo = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      if (Math.ceil(scrollLeft) >= scrollWidth - clientWidth - 5) {
        const firstChild = carouselRef.current.firstElementChild;
        if (firstChild) {
          carouselRef.current.style.scrollBehavior = 'auto';
          carouselRef.current.appendChild(firstChild);
          carouselRef.current.scrollLeft -= 295;
          void carouselRef.current.offsetWidth;
          carouselRef.current.style.scrollBehavior = 'smooth';
        }
      }
      carouselRef.current.scrollBy({ left: 295 });
    }
  };

  const handlePrevPromo = () => {
    if (carouselRef.current) {
      if (carouselRef.current.scrollLeft <= 5) {
        const lastChild = carouselRef.current.lastElementChild;
        if (lastChild) {
          carouselRef.current.style.scrollBehavior = 'auto';
          carouselRef.current.prepend(lastChild);
          carouselRef.current.scrollLeft += 295;
          void carouselRef.current.offsetWidth;
          carouselRef.current.style.scrollBehavior = 'smooth';
        }
      }
      carouselRef.current.scrollBy({ left: -295 });
    }
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      handleNextPromo();
    }, 5000); 
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/movies');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        const data = await response.json();

        if (data.success && data.movies) {
          setMovies(data.movies);
        } else {
          throw new Error('Format data dari server tidak sesuai');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="app-container">

      {/* 1. NAVBAR DENGAN LOGIKA LOGIN */}
      <nav className="navbar" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 40px', 
        backgroundColor: '#0b0f19',
        borderBottom: '1px solid #1f2937'
      }}>
        
        <img 
          src={logoImage} 
          alt="TIXCO Logo" 
          className="nav-logo" 
          onClick={() => navigate('/')} 
        />

        <div className="nav-menu">
          <div className="nav-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
              <path d="M9 15c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1Z"/>
              <path d="M15 9c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1Z"/>
              <path d="m9 9 6 6"/>
            </svg>
            <span>Promo</span>
          </div>

          {/* ==========================================
              KONDISI JIKA USER SUDAH LOGIN
          ========================================== */}
          {isLoggedIn ? (
            <>
              {/* Tombol Logout */}
              <div className="nav-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
                <LogOut size={20} />
                <span>Logout</span>
              </div>
              
              {/* Tombol Riwayat Tiket menggantikan Buat Akun */}
              <button className="btn-register-nav" onClick={() => navigate('/history')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket size={18} />
                Riwayat Tiket
              </button>
            </>
          ) : (
          /* ==========================================
              KONDISI JIKA USER BELUM LOGIN
          ========================================== */
            <>
              <div className="nav-item" onClick={() => navigate('/login')}>
                <span>Login</span>
              </div>
              <button className="btn-register-nav" onClick={() => navigate('/login')}>
                Buat akun
              </button>
            </>
          )}

        </div>
      </nav>

      {/* 2. AREA PENCARIAN */}
      <section className="hero-search-section">
        <h1 className="hero-title">Feel the meanings beyond</h1>
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Cari film atau bioskop" className="search-input" />
        </div>
      </section>
      {/* 4. NOW SHOWING IN CINEMAS */}
    <section className="movies-section">
        <h2 className="section-title">NOW SHOWING IN CINEMAS</h2>
        {isLoading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={40} />
            <p>Memuat film...</p>
          </div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <div className="movies-container">
            <div className="movie-grid">
              {movies.slice(0, 4).map((movie) => (
                <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
                  <div className="movie-poster">
                    <img src={movie.posterUrl || 'https://placehold.co/400x600/eeeeee/999999?text=NO+POSTER'} alt={movie.title} />
                  </div>
                  <h3 className="movie-title">{movie.title}</h3>
                </div>
              ))}
            </div>

            <div className="slider-nav">
              <button className="nav-btn"><ChevronLeft size={18} /></button>
              <div className="slider-dots">
                <div className="dot active"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <button className="nav-btn"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </section>

      {/* 5. FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoImage} alt="TIXCO Logo" className="footer-logo" />
            <p>Platform hiburan terdepan di Indonesia. Pesan tiket bioskop dan acara favoritmu dengan cepat, mudah, dan aman tanpa harus antre.</p>
          </div>
          <div className="footer-links">
            <h4>PERUSAHAAN</h4>
            <ul>
              <li><a href="#">Tentang Kami</a></li>
              <li><a href="#">Karir</a></li>
              <li><a href="#">Hubungi Kami</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>DUKUNGAN</h4>
            <ul>
              <li><a href="#">Pusat Bantuan</a></li>
              <li><a href="#">Syarat & Ketentuan</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Nontonyuk. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}