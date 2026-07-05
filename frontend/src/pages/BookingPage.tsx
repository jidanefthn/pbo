import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Armchair } from 'lucide-react';
import logoImage from '../assets/logo.png'; 

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [moviePrice, setMoviePrice] = useState(0);

  // Mengambil harga dari database/API
  useEffect(() => {
    fetch(`http://localhost:3000/api/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMoviePrice(data.movie.price);
      })
      .catch(err => console.error("Gagal ambil harga:", err));
  }, [id]);

  // Layout 10 baris (A-J) x 12 kolom = 120 kursi
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = 12;

  const toggleSeat = (seat: string) => {
    setSelectedSeats(prev => 
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="booking-layout">
      <nav className="booking-nav">
        <button className="btn-back" onClick={() => navigate(`/movie/${id}`)}>
          <ArrowLeft size={24} />
        </button>
        <h2>Pilih Kursi</h2>
        <img src={logoImage} alt="Logo" className="nav-logo-booking" />
      </nav>

      <div className="screen-indicator">LAYAR BIOSKOP</div>

      <div className="seat-container">
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
                  >
                    <Armchair size={20} />
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="booking-footer">
        <div className="summary">
          <p>Kursi: {selectedSeats.join(', ') || '-'}</p>
          <p>Total: <strong>Rp {((selectedSeats.length * moviePrice) || 0).toLocaleString('id-ID')}</strong></p>
        </div>
        <button 
          className="btn-pay" 
          disabled={selectedSeats.length === 0}
          onClick={() => alert('Pembayaran diproses...')}
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}