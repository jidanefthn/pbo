import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, LayoutGrid, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function AdminStudioPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'studio' | 'jadwal'>('studio');

  // --- STATE MODAL STUDIO ---
  const [showStudioForm, setShowStudioForm] = useState(false);
  const [studioFormData, setStudioFormData] = useState({
    name: '',
    status: 'Tersedia'
  });

  // --- STATE MODAL TAMBAH JADWAL ---
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    movieTitle: '',
    studioName: '',
    date: '',
    time: ''
  });

  // --- 🌟 STATE MODAL EDIT JADWAL ---
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState({
    id: 0,
    movieTitle: '',
    studioName: '',
    date: '',
    time: ''
  });

  // --- MOCK DATA STUDIO ---
  const [studios, setStudios] = useState([
    { id: 1, name: 'Studio 1 Ultra XD', status: 'Tersedia' },
    { id: 2, name: 'Studio 2 Gold VIP', status: 'Tidak Tersedia' },
    { id: 3, name: 'Studio 3 Dolby Atmos', status: 'Tersedia' },
  ]);

  // --- MOCK DATA JADWAL ---
  const [schedules, setSchedules] = useState([
    { id: 1, movieTitle: 'PETAKA GUNUNG WELIRANG', studioName: 'Studio 1 Ultra XD', time: '14:30', date: '2026-07-07' },
    { id: 2, movieTitle: 'TOY STORY 4', studioName: 'Studio 3 Dolby Atmos', time: '17:00', date: '2026-07-07' },
  ]);

  // --- FUNGSI SUBMIT STUDIO ---
  const handleStudioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudio = {
      id: Date.now(),
      name: studioFormData.name,
      status: studioFormData.status
    };
    setStudios([...studios, newStudio]);
    setStudioFormData({ name: '', status: 'Tersedia' });
    setShowStudioForm(false);
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Tersedia' ? 'Tidak Tersedia' : 'Tersedia';
    setStudios(studios.map(s => s.id === id ? { ...s, status: nextStatus } : s));
  };

  const handleDeleteStudio = (id: number, name: string) => {
    if (window.confirm(`Hapus ${name}? Semua jadwal di studio ini juga akan terpengaruh.`)) {
      setStudios(studios.filter(s => s.id !== id));
    }
  };

  // --- FUNGSI SUBMIT JADWAL BARU ---
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule = {
      id: Date.now(),
      movieTitle: scheduleFormData.movieTitle,
      studioName: scheduleFormData.studioName,
      date: scheduleFormData.date,
      time: scheduleFormData.time
    };
    setSchedules([...schedules, newSchedule]);
    setScheduleFormData({ movieTitle: '', studioName: '', date: '', time: '' });
    setShowScheduleForm(false);
  };

  // --- 🌟 FUNGSI MEMBUKA FORM EDIT JADWAL ---
  const handleOpenEditSchedule = (sch: any) => {
    setEditingSchedule({
      id: sch.id,
      movieTitle: sch.movieTitle,
      studioName: sch.studioName,
      date: sch.date,
      time: sch.time
    });
    setShowEditScheduleModal(true);
  };

  // --- 🌟 FUNGSI SIMPAN PERUBAHAN EDIT JADWAL ---
  const handleEditScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedules(schedules.map(sch => 
      sch.id === editingSchedule.id ? { ...editingSchedule } : sch
    ));
    setShowEditScheduleModal(false);
    alert("Jadwal film berhasil diperbarui!");
  };

  const handleDeleteSchedule = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal tayang ini?")) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR LEFT */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={logoImage} alt="TIXCO Logo" onClick={() => navigate('/')} />
        </div>
        
        <nav className="sidebar-menu">
          <button onClick={() => navigate('/admin/movies')}>
            <Film size={20} /> Kelola Film
          </button>
          
          <button className="active" onClick={() => navigate('/admin/studios')}>
            <LayoutGrid size={20} /> Kelola Studio & Jadwal
          </button>
        </nav>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="admin-content" style={{ position: 'relative' }}>
        <header className="admin-header" style={{ marginBottom: '10px' }}>
          <h1>Dashboard Studio & Jadwal</h1>
        </header>

        {/* SUB NAV TAB */}
        <div className="admin-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #1f2937', paddingBottom: '10px' }}>
          <button 
            onClick={() => setActiveTab('studio')}
            style={{
              background: 'none', border: 'none', color: activeTab === 'studio' ? '#82ebd5' : '#9ca3af',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '5px 10px',
              borderBottom: activeTab === 'studio' ? '2px solid #82ebd5' : 'none'
            }}
          >
            Manajemen Studio
          </button>
          <button 
            onClick={() => setActiveTab('jadwal')}
            style={{
              background: 'none', border: 'none', color: activeTab === 'jadwal' ? '#82ebd5' : '#9ca3af',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', padding: '5px 10px',
              borderBottom: activeTab === 'jadwal' ? '2px solid #82ebd5' : 'none'
            }}
          >
            Manajemen Jadwal Film
          </button>
        </div>

        {/* TAMPILAN TAB 1: KELOLA STUDIO */}
{activeTab === 'studio' && (
  <div className="page-transition">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <h3>Daftar Studio Bioskop</h3>

      <button
        className="btn-add"
        onClick={() => setShowStudioForm(true)}
      >
        <Plus size={18} /> Tambah Studio
      </button>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nama Studio</th>
            <th>Status Ketersediaan</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {studios.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>

              <td>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor:
                      s.status === 'Tersedia'
                        ? '#064e3b'
                        : '#7f1d1d',
                    color:
                      s.status === 'Tersedia'
                        ? '#34d399'
                        : '#f87171',
                  }}
                >
                  {s.status}
                </span>
              </td>

              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() =>
                    handleToggleStatus(s.id, s.status)
                  }
                  title="Ubah Status Ketersediaan"
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#38bdf8',
                  }}
                >
                  {s.status === 'Tersedia' ? (
                    <X size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                </button>

                <button
                  className="btn-delete"
                  onClick={() =>
                    handleDeleteStudio(s.id, s.name)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

        {/* TAMPILAN TAB 2: KELOLA JADWAL */}
        {activeTab === 'jadwal' && (
          <div className="page-transition">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Jadwal Penayangan Aktif</h3>
              <button className="btn-add" onClick={() => setShowScheduleForm(true)}>
                <Plus size={18} /> Tambah Jadwal
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Judul Film</th>
                    <th>Studio</th>
                    <th>Tanggal</th>
                    <th>Jam Tayang</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((sch) => (
                    <tr key={sch.id}>
                      <td style={{ fontWeight: 'bold' }}>{sch.movieTitle}</td>
                      <td>{sch.studioName}</td>
                      <td>{sch.date}</td>
                      <td style={{ color: '#82ebd5', fontWeight: 'bold' }}>{sch.time} WIB</td>
                      <td className="actions">
                        {/* 🌟 Tombol edit dihubungkan ke fungsi pembuka modal edit */}
                        <button className="btn-edit" onClick={() => handleOpenEditSchedule(sch)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteSchedule(sch.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL FORM TAMBAH STUDIO */}
        {showStudioForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#0b0f19', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid #1f2937' }} className="page-transition">
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Tambah Studio Baru</h2>
              <form onSubmit={handleStudioSubmit} className="admin-form">
                <label>Nama Studio</label>
                <input type="text" value={studioFormData.name} onChange={e => setStudioFormData({...studioFormData, name: e.target.value})} placeholder="Contoh: Studio 4 IMAX" required style={{ marginBottom: '20px' }} />
                <label>Status Ketersediaan</label>
                <select value={studioFormData.status} onChange={e => setStudioFormData({...studioFormData, status: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', outline: 'none', marginBottom: '30px', fontSize: '15px' }}>
                  <option value="Tersedia">Tersedia</option>
                  <option value="Tidak Tersedia">Tidak Tersedia</option>
                </select>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowStudioForm(false)}>Batal</button>
                  <button type="submit" className="btn-save">Simpan Studio</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FORM TAMBAH JADWAL */}
        {showScheduleForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#0b0f19', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid #1f2937' }} className="page-transition">
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Tambah Jadwal Tayang</h2>
              <form onSubmit={handleScheduleSubmit} className="admin-form">
                <label>Judul Film</label>
                <input type="text" value={scheduleFormData.movieTitle} onChange={e => setScheduleFormData({...scheduleFormData, movieTitle: e.target.value})} placeholder="Contoh: Petaka Gunung Welirang" required style={{ marginBottom: '15px' }} />
                <label>Pilih Studio</label>
                <select value={scheduleFormData.studioName} onChange={e => setScheduleFormData({...scheduleFormData, studioName: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', outline: 'none', marginBottom: '15px', fontSize: '15px' }}>
                  <option value="" disabled>-- Pilih Studio --</option>
                  {studios.filter(s => s.status === 'Tersedia').map(studio => (
                    <option key={studio.id} value={studio.name}>{studio.name}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Tanggal Tayang</label>
                    <input type="date" value={scheduleFormData.date} onChange={e => setScheduleFormData({...scheduleFormData, date: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Jam Tayang</label>
                    <input type="time" value={scheduleFormData.time} onChange={e => setScheduleFormData({...scheduleFormData, time: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', outline: 'none' }} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowScheduleForm(false)}>Batal</button>
                  <button type="submit" className="btn-save">Simpan Jadwal</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 🌟 MODAL FORM EDIT JADWAL */}
        {showEditScheduleModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#0b0f19', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid #1f2937' }} className="page-transition">
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Edit Jadwal Tayang</h2>
              <form onSubmit={handleEditScheduleSubmit} className="admin-form">
                
                <label>Judul Film</label>
                <input 
                  type="text" 
                  value={editingSchedule.movieTitle} 
                  onChange={e => setEditingSchedule({...editingSchedule, movieTitle: e.target.value})} 
                  required 
                  style={{ marginBottom: '15px' }}
                />

                <label>Pilih Studio</label>
                <select 
                  value={editingSchedule.studioName} 
                  onChange={e => setEditingSchedule({...editingSchedule, studioName: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', outline: 'none', marginBottom: '15px', fontSize: '15px' }}
                >
                  {/* Menampilkan studio aktif saat ini serta daftar studio lain yang berstatus 'Tersedia' */}
                  {studios.map(studio => (
                    <option key={studio.id} value={studio.name} disabled={studio.status !== 'Tersedia' && studio.name !== editingSchedule.studioName}>
                      {studio.name} {studio.status !== 'Tersedia' ? '(Nonaktif)' : ''}
                    </option>
                  ))}
                </select>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Tanggal Tayang</label>
                    <input 
                      type="date" 
                      value={editingSchedule.date} 
                      onChange={e => setEditingSchedule({...editingSchedule, date: e.target.value})} 
                      required 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', outline: 'none' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Jam Tayang</label>
                    <input 
                      type="time" 
                      value={editingSchedule.time} 
                      onChange={e => setEditingSchedule({...editingSchedule, time: e.target.value})} 
                      required 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151', outline: 'none' }} 
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditScheduleModal(false)}>Batal</button>
                  <button type="submit" className="btn-save" style={{ backgroundColor: '#38bdf8', color: '#0b0f19' }}>Update Jadwal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}