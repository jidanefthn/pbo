import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  description: string;
  posterUrl: string;
  price: number;
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK JADWAL TAYANG ---
  const [selectedDate, setSelectedDate] = useState('2026-07-07');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);

  const availableDates = [
    { date: '2026-07-07', label: 'Hari Ini' },
    { date: '2026-07-08', label: 'Besok' },
    { date: '2026-07-09', label: 'Lusa' }
  ];

  const mockSchedules = [
    { id: 1, studioName: 'Studio 1 Ultra XD', time: '12:30', date: '2026-07-07' },
    { id: 2, studioName: 'Studio 1 Ultra XD', time: '14:45', date: '2026-07-07' },
    { id: 3, studioName: 'Studio 1 Ultra XD', time: '18:15', date: '2026-07-07' },
    { id: 4, studioName: 'Studio 3 Dolby Atmos', time: '13:00', date: '2026-07-07' },
    { id: 5, studioName: 'Studio 3 Dolby Atmos', time: '16:20', date: '2026-07-07' },
    { id: 6, studioName: 'Studio 1 Ultra XD', time: '14:30', date: '2026-07-08' },
  ];

  const filteredSchedules = mockSchedules.filter(sch => sch.date === selectedDate);
  const schedulesByStudio = filteredSchedules.reduce((acc, curr) => {
    if (!acc[curr.studioName]) acc[curr.studioName] = [];
    acc[curr.studioName].push(curr.time);
    return acc;
  }, {} as Record<string, string[]>);

  useEffect(() => {
    window.scrollTo(0, 0); 

    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`);
        const data = await response.json();
        if (data.success && data.movie) {
          setMovie(data.movie);
        }
      } catch (error) {
        console.error("Gagal mengambil detail film:", error);
        setMovie({
          id: Number(id),
          title: 'MINIONS & MONSTERS',
          genre: 'Animations',
          duration: 90,
          price: 50000,
          description: 'Petualangan para Minion di Hollywood tahun 1920-an saat mereka mencari makhluk-makhluk menakutkan untuk film monster mereka. Para Minion bekerja sama dengan makhluk hijau untuk menyelamatkan planet ini setelah mereka melepaskan monster-monster berbahaya.',
          posterUrl: 'https://placehold.co/400x600/f59e0b/000000?text=Minions+Poster'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  const handleTimeSelect = (studio: string, time: string) => {
    setSelectedStudio(studio);
    setSelectedTime(time);
  };

  const handleOrder = () => {
    if (!selectedTime || !selectedStudio) {
      alert('Silakan pilih jadwal tayang terlebih dahulu!');
      return;
    }
    navigate(`/booking/${movie?.id}`, {
      state: { selectedDate, selectedStudio, selectedTime, movie }
    });
  };

  if (isLoading) {
    return <div className="loading-text" style={{ padding: '50px', textAlign: 'center', color: '#82ebd5' }}>Memuat detail film...</div>;
  }

  return (
    <div className="movie-layout-modern">
      
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
          <div 
            className="hero-backdrop"
            style={{ backgroundImage: `url(${movie.posterUrl})` }}
          >
            <div className="backdrop-overlay"></div>
          </div>

          <div className="modern-content-container">
            
            {/* BARIS 1: POSTER DAN INFO */}
            <div className="movie-header-row">
              <div className="poster-small-wrapper">
                <img 
                  src={movie.posterUrl || 'https://placehold.co/400x600/111827/ffffff?text=NO+POSTER'} 
                  alt={movie.title} 
                  className="poster-small"
                />
              </div>

              <div className="movie-info-right">
                <h1 className="modern-movie-title">{movie.title}</h1>
                
                <div className="modern-movie-meta">
                  <span className="meta-genre-badge">{movie.genre}</span>
                  <div className="meta-duration">
                    <Clock size={16} className="icon-cyan" />
                    <span>{movie.duration} Menit</span>
                  </div>
                </div>

                <div className="modern-synopsis-section" style={{ marginBottom: '20px' }}>
                  <h3>Sinopsis</h3>
                  <p className="modern-synopsis-text">{movie.description}</p>
                </div>
              </div>
            </div>
            {/* AKHIR BARIS 1 */}

            {/* BARIS 2: PILIHAN JADWAL (Dikeluarkan dari kolom kanan agar merentang penuh ke kiri) */}
            <div style={{ backgroundColor: 'rgba(11, 15, 25, 0.6)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', color: '#f3f4f6', margin: '0 0 25px 0' }}>
                <CalendarIcon size={20} className="icon-cyan" /> Pilih Jadwal Tayang
              </h3>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                {availableDates.map(d => (
                  <button 
                    key={d.date}
                    onClick={() => {
                      setSelectedDate(d.date);
                      setSelectedTime(null); 
                      setSelectedStudio(null);
                    }}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: selectedDate === d.date ? '1px solid #82ebd5' : '1px solid #374151',
                      backgroundColor: selectedDate === d.date ? 'rgba(130, 235, 213, 0.1)' : 'transparent',
                      color: selectedDate === d.date ? '#82ebd5' : '#d1d5db',
                      cursor: 'pointer',
                      minWidth: '110px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '13px', marginBottom: '4px' }}>{d.label}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{d.date.split('-').reverse().join('/')}</div>
                  </button>
                ))}
              </div>

              {Object.keys(schedulesByStudio).length > 0 ? (
                Object.keys(schedulesByStudio).map(studio => (
                  <div key={studio} style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px', fontWeight: 'normal' }}>{studio}</h4>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {schedulesByStudio[studio].map(time => {
                        const isSelected = selectedStudio === studio && selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(studio, time)}
                            style={{
                              padding: '10px 24px',
                              borderRadius: '8px',
                              border: isSelected ? 'none' : '1px solid #374151',
                              backgroundColor: isSelected ? '#82ebd5' : '#1f2937',
                              color: isSelected ? '#0b0f19' : 'white',
                              fontWeight: 'bold',
                              fontSize: '15px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#ef4444', padding: '15px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '14px' }}>
                  Maaf, tidak ada jadwal penayangan untuk tanggal ini.
                </div>
              )}
            </div>

            {/* BARIS 3: MENU TOMBOL AKSI */}
            <div className="modern-action-menu">
              <button className="btn-action-cancel" onClick={() => navigate('/')}>
                Batalkan
              </button>
              
              <button 
                className="btn-action-order" 
                onClick={handleOrder}
                disabled={!selectedTime}
                style={{ 
                  opacity: selectedTime ? 1 : 0.5, 
                  cursor: selectedTime ? 'pointer' : 'not-allowed' 
                }}
              >
                Buat Pesanan {selectedTime ? `(${selectedTime})` : ''}
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}