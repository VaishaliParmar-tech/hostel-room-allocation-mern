import { useState, useEffect } from 'react';
import { getAvailableRooms, submitRequest } from '../../services/api.service';

const ApplyRoom = () => {
  const [rooms, setRooms]       = useState([]);
  const [formData, setFormData] = useState({ roomType: '', preferredBlock: '' });
  const [message, setMessage]   = useState({ text: '', type: '' });
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    getAvailableRooms().then(res => setRooms(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage({ text: '', type: '' });
    try {
      await submitRequest(formData);
      setMessage({ text: 'Room request submitted successfully! Waiting for warden approval.', type: 'success' });
      setFormData({ roomType: '', preferredBlock: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Submission failed', type: 'danger' });
    } finally { setLoading(false); }
  };

  const blocks = [...new Set(rooms.map(r => r.hostelBlock))];

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-plus-circle me-2"></i>Apply for Room</h3>
      <p className="text-muted">Fill the form below to submit your room request.</p>

      <div className="row">
        <div className="col-md-5">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">Room Request Form</div>
            <div className="card-body">
              {message.text && (
                <div className={`alert alert-${message.type} py-2`}>{message.text}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Room Type *</label>
                  <select className="form-select" value={formData.roomType}
                    onChange={e => setFormData({ ...formData, roomType: e.target.value })} required>
                    <option value="">Select room type</option>
                    <option value="Single">Single (1 person)</option>
                    <option value="Double">Double (2 persons)</option>
                    <option value="Triple">Triple (3 persons)</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Preferred Block</label>
                  <select className="form-select" value={formData.preferredBlock}
                    onChange={e => setFormData({ ...formData, preferredBlock: e.target.value })}>
                    <option value="">No preference</option>
                    {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</> : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <h5 className="mb-3">
            <i className="bi bi-door-open me-2"></i>
            Available Rooms ({rooms.length})
          </h5>
          {rooms.length === 0 ? (
            <div className="alert alert-warning">No rooms available at the moment.</div>
          ) : (
            <div className="row g-2">
              {rooms.map(room => (
                <div className="col-md-6" key={room._id}>
                  <div className="card border-success h-100">
                    <div className="card-body py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 text-success"><i className="bi bi-door-open me-1"></i>{room.roomNumber}</h6>
                        <span className="badge bg-success">Available</span>
                      </div>
                      <small className="text-muted">
                        {room.hostelBlock} | {room.roomType} | Floor {room.floor}<br />
                        Capacity: {room.capacity} | Occupied: {room.occupiedBy?.length || 0}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyRoom;
