import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Armchair, Calendar, Clock, MapPin } from 'lucide-react';
import logoImage from '../assets/logo.png'; 

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Menangkap data yang dikirim dari HomeDetailPage
  const { selectedDate, selectedStudio, selectedTime, movie: stateMovie } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [moviePrice, setMoviePrice] = useState(0);
  const [movieTitle, setMovieTitle] = useState('');

  // 2. Proteksi Halaman & Pengaturan Data
  useEffect(() => {
    // Jika tidak ada data jadwal (misal user langsung mengetik URL /booking/1), kembalikan ke detail film
    if (!selectedTime || !selectedStudio) {
      alert('Silakan pilih jadwal tayang terlebih dahulu!');
      navigate(`/movie/${id}`);
      return;
    }

    // Jika data movie terbawa dari state, gunakan itu (lebih cepat). Jika tidak, fetch lagi.
    if (stateMovie) {
      setMoviePrice(stateMovie.price);
      setMovieTitle(stateMovie.title);
    } else {
      fetch(`http://localhost:3000/api/movies/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMoviePrice(data.movie.price);
            setMovieTitle(data.movie.title);
          }
        })
        .catch(err => console.error("Gagal ambil data film:", err));
    }
  }, [id, selectedTime, selectedStudio, navigate, stateMovie]);

  // Layout 10 baris (A-J) x 12 kolom = 120 kursi
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = 12;

  const toggleSeat = (seat: string) => {
    setSelectedSeats(prev => 
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="booking-layout page-transition">
      
      {/* NAVBAR */}
      <nav className="booking-nav">
        <button className="btn-back" onClick={() => navigate(`/movie/${id}`)}>
          <ArrowLeft size={24} />
        </button>
        <h2>Pilih Kursi</h2>
        <img src={logoImage} alt="Logo" className="nav-logo-booking" />
      </nav>

      {/* INFORMASI JADWAL TERPILIH */}
      <div style={{ backgroundColor: '#111827', padding: '15px 40px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: '#f3f4f6' }}>{movieTitle || 'Memuat...'}</h3>
          <div style={{ display: 'flex', gap: '15px', color: '#9ca3af', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} color="#82ebd5"/> {selectedDate?.split('-').reverse().join('/')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} color="#82ebd5"/> {selectedTime} WIB</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} color="#82ebd5"/> {selectedStudio}</span>
          </div>
        </div>
      </div>

      {/* AREA DENAH KURSI */}
      <div className="screen-indicator" style={{ marginTop: '30px' }}>LAYAR BIOSKOP</div>

      <div className="seat-container" style={{ paddingBottom: '120px' }}>
        <div className="seat-grid">
          {rows.map(row => (
            <React.Fragment key={row}>
              {[...Array(cols)].map((_, i) => {
                const seatId = `${row}${i + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                
                return (
                  <button 
                    key={seatId} 
                    className={`seat ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSeat(seatId)}
                    title={`Kursi ${seatId}`}
                  >
                    <Armchair size={20} />
                    <span style={{ fontSize: '10px', display: 'block', marginTop: '-3px' }}>{seatId}</span>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* FOOTER PEMBAYARAN */}
      <div className="booking-footer">
        <div className="summary">
          <p style={{ margin: '0 0 5px 0', color: '#9ca3af' }}>Kursi Terpilih: <strong style={{ color: '#fff' }}>{selectedSeats.join(', ') || '-'}</strong></p>
          <p style={{ margin: 0, fontSize: '18px' }}>Total Harga: <strong style={{ color: '#82ebd5' }}>Rp {((selectedSeats.length * moviePrice) || 0).toLocaleString('id-ID')}</strong></p>
        </div>
        <button 
          className="btn-pay" 
          disabled={selectedSeats.length === 0}
          onClick={() => alert(`Pembayaran diproses untuk kursi: ${selectedSeats.join(', ')}\nTotal: Rp ${(selectedSeats.length * moviePrice).toLocaleString('id-ID')}`)}
          style={{
            backgroundColor: selectedSeats.length === 0 ? '#374151' : '#82ebd5',
            color: selectedSeats.length === 0 ? '#9ca3af' : '#0b0f19',
            padding: '12px 30px',
            borderRadius: '8px',
            fontWeight: 'bold',
            border: 'none',
            cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}