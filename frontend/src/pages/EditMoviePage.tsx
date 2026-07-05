import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditMoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    title: '',
    genre: '',
    duration: '',
    posterUrl: '',
    description: '',
    price: ''
  });

  // Ambil data film saat halaman dimuat
  useEffect(() => {
    fetch(`http://localhost:3000/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data.movie))
      .catch(err => console.error("Gagal memuat data:", err));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:3000/api/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie)
    });
    alert('Film berhasil diperbarui!');
    navigate('/admin/movies');
  };

  return (
    <div className="admin-form-container">
      <h1>Edit Film</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Judul Film</label>
        <input value={movie.title} onChange={e => setMovie({...movie, title: e.target.value})} required />
        
        <div className="form-row">
          <div>
            <label>Genre</label>
            <input value={movie.genre} onChange={e => setMovie({...movie, genre: e.target.value})} />
          </div>
          <div>
            <label>Durasi (Menit)</label>
            <input value={movie.duration} onChange={e => setMovie({...movie, duration: e.target.value})} />
          </div>
          <div>
            <label>Harga (Rp)</label>
            <input type="number" value={movie.price} onChange={e => setMovie({...movie, price: e.target.value})} />
          </div>
        </div>

        <label>Tautan Poster (URL)</label>
        <input value={movie.posterUrl} onChange={e => setMovie({...movie, posterUrl: e.target.value})} />

        <label>Sinopsis</label>
        <textarea value={movie.description} onChange={e => setMovie({...movie, description: e.target.value})} rows={5} />

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/movies')}>Batal</button>
          <button type="submit" className="btn-save">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  );
}