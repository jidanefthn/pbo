import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  description: string;
  posterUrl: string;
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`);
        const data = await response.json();
        if (data.success && data.movie) {
          setMovie(data.movie);
        }
      } catch (error) {
        console.error("Gagal mengambil detail film:", error);
        // Data fallback (Contoh: Minions sesuai ide Anda)
        setMovie({
          id: Number(id),
          title: 'MINIONS: THE RISE OF GRU',
          genre: 'Animation, Comedy',
          duration: 90,
          description: 'Berlatar tahun 1970-an, Gru yang masih berusia 12 tahun berusaha membuktikan dirinya sebagai calon penjahat super terhebat. Bersama pasukan Minion yang setia, ia menyusun rencana untuk bergabung dengan kelompok penjahat legendaris bernama Vicious 6. Namun, rencananya menjadi kacau dan ia malah menjadi buronan utama mereka.',
          posterUrl: 'https://placehold.co/400x600/f59e0b/000000?text=Minions+Poster' // Poster kuning Minion
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (isLoading) {
    return <div className="loading-text">Memuat detail film...</div>;
  }

  return (
    <div className="movie-layout-modern">
      
      {/* 1. NAVBAR FIXED */}
      <nav className="navbar-detail">
        <img 
          src={logoImage} 
          alt="Logo" 
          className="nav-logo-short" 
          onClick={() => navigate('/')} 
        />
      </nav>

      {movie && (
        <>
          {/* 2. BACKGROUND GRADASI DARI POSTER */}
          <div 
            className="hero-backdrop"
            style={{ backgroundImage: `url(${movie.posterUrl})` }}
          >
            <div className="backdrop-overlay"></div>
          </div>

          {/* 3. KONTEN UTAMA (KIRI POSTER, KANAN TEKS) */}
          <div className="modern-content-container">
            
            <div className="movie-header-row">
              {/* Bagian Kiri: Poster Kecil */}
              <div className="poster-small-wrapper">
                <img 
                  src={movie.posterUrl || 'https://placehold.co/400x600/111827/ffffff?text=NO+POSTER'} 
                  alt={movie.title} 
                  className="poster-small"
                />
              </div>

              {/* Bagian Kanan: Info Film */}
              <div className="movie-info-right">
                <h1 className="modern-movie-title">{movie.title}</h1>
                
                <div className="modern-movie-meta">
                  <span className="meta-genre-badge">{movie.genre}</span>
                  <div className="meta-duration">
                    <Clock size={16} className="icon-cyan" />
                    <span>{movie.duration} Menit</span>
                  </div>
                </div>

                <div className="modern-synopsis-section">
                  <h3>Sinopsis</h3>
                  {/* Teks warna putih sedikit gelap diatur di CSS */}
                  <p className="modern-synopsis-text">{movie.description}</p>
                </div>
              </div>
            </div>

            {/* 4. MENU TOMBOL AKSI */}
            <div className="modern-action-menu">
              <button className="btn-action-cancel" onClick={() => navigate('/')}>
                Batalkan
              </button>
              <button className="btn-action-order" onClick={() => navigate(`/booking/${movie.id}`)}>
                Buat Pesanan
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}