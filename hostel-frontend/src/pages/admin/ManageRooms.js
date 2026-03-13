import { useState, useEffect } from 'react';
import { getRooms, createRoom, deleteRoom } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';

const ManageRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ roomNumber: '', hostelBlock: '', capacity: '', roomType: '', floor: '' });

  const fetchRooms = async () => {
    try { const res = await getRooms(); setRooms(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createRoom({ ...form, capacity: Number(form.capacity), floor: Number(form.floor) });
      setMsg({ text: 'Room added!', type: 'success' });
      setForm({ roomNumber: '', hostelBlock: '', capacity: '', roomType: '', floor: '' });
      setShowForm(false);
      fetchRooms();
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Error adding room', type: 'danger' }); }
  };

  const handleDelete = async (id, num) => {
    if (!window.confirm(`Delete room ${num}?`)) return;
    try { await deleteRoom(id); fetchRooms(); setMsg({ text: `Room ${num} deleted.`, type: 'info' }); }
    catch (err) { setMsg({ text: 'Error deleting room', type: 'danger' }); }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-info"></div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3><i className="bi bi-door-open me-2"></i>Manage Rooms ({rooms.length})</h3>
        {user.role === 'admin' && (
          <button className="btn btn-info text-white" onClick={() => setShowForm(!showForm)}>
            <i className="bi bi-plus-circle me-1"></i>{showForm ? 'Cancel' : 'Add Room'}
          </button>
        )}
      </div>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {showForm && user.role === 'admin' && (
        <div className="card mb-4 border-info">
          <div className="card-header bg-info text-white">Add New Room</div>
          <div className="card-body">
            <form onSubmit={handleAdd}>
              <div className="row g-3">
                <div className="col-md-4">
                  <input className="form-control" placeholder="Room Number (e.g. A-101) *" value={form.roomNumber}
                    onChange={e => setForm({ ...form, roomNumber: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <input className="form-control" placeholder="Hostel Block (e.g. Block A) *" value={form.hostelBlock}
                    onChange={e => setForm({ ...form, hostelBlock: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <select className="form-select" value={form.roomType}
                    onChange={e => setForm({ ...form, roomType: e.target.value })} required>
                    <option value="">Room Type *</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <input type="number" className="form-control" placeholder="Capacity *" value={form.capacity}
                    onChange={e => setForm({ ...form, capacity: e.target.value })} required min={1} max={3} />
                </div>
                <div className="col-md-4">
                  <input type="number" className="form-control" placeholder="Floor *" value={form.floor}
                    onChange={e => setForm({ ...form, floor: e.target.value })} required />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-info text-white">Add Room</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3">
        {rooms.map(room => (
          <div className="col-md-4" key={room._id}>
            <div className={`card h-100 border-${room.isAvailable ? 'success' : 'danger'}`}>
              <div className={`card-header d-flex justify-content-between align-items-center bg-${room.isAvailable ? 'success' : 'danger'} text-white`}>
                <strong><i className="bi bi-door-open me-1"></i>{room.roomNumber}</strong>
                <span className="badge bg-light text-dark">{room.isAvailable ? 'Available' : 'Full'}</span>
              </div>
              <div className="card-body">
                <p className="mb-1"><strong>Block:</strong> {room.hostelBlock}</p>
                <p className="mb-1"><strong>Type:</strong> {room.roomType}</p>
                <p className="mb-1"><strong>Floor:</strong> {room.floor}</p>
                <p className="mb-0"><strong>Occupancy:</strong> {room.occupiedBy?.length || 0}/{room.capacity}</p>
              </div>
              {user.role === 'admin' && (
                <div className="card-footer">
                  <button className="btn btn-sm btn-outline-danger w-100" onClick={() => handleDelete(room._id, room.roomNumber)}>
                    <i className="bi bi-trash me-1"></i>Delete Room
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRooms;
