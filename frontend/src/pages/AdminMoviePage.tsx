import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, LogOut } from 'lucide-react';
import logoImage from '../assets/logo.png';
export default function AdminMoviePage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  // Fungsi untuk mengambil data dari server
  const fetchAllMovies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      const data = await response.json();
      if (data.success) {
        setMovies(data.movies); // Memasukkan data ke state
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  // Jalankan saat halaman pertama kali dimuat
  useEffect(() => {
    fetchAllMovies();
  }, []);

  // Fungsi untuk hapus film
  const deleteMovie = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus film ini?")) {
      await fetch(`http://localhost:3000/api/movies/${id}`, { method: 'DELETE' });
      fetchAllMovies(); // Refresh tabel setelah hapus
    }
  };

  return (
    <div className="admin-layout">
      {/* ... sidebar tetap sama ... */}
      
      <main className="admin-content">
        <header className="admin-header">
          <h1>Kelola Film</h1>
          <button className="btn-add" onClick={() => navigate('/admin/add-movie')}>
            <Plus size={18} /> Tambah Film
          </button>
        </header>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Judul Film</th>
                <th>Genre</th>
                <th>Durasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map((m: any) => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{m.genre}</td>
                    <td>{m.duration} Menit</td>
                    <td className="actions">
                      <button className="btn-edit" onClick={() => navigate(`/admin/edit-movie/${m.id}`)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-delete" onClick={() => deleteMovie(m.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                    Belum ada film yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}