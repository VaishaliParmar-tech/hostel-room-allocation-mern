import { useState, useEffect } from 'react';
import { getAllRequests, getRooms, allocateRoom, getAllAllocations, vacateRoom } from '../../services/api.service';

const AllocateRoom = () => {
  const [approvedReqs, setApprovedReqs] = useState([]);
  const [rooms, setRooms]               = useState([]);
  const [allocations, setAllocations]   = useState([]);
  const [form, setForm]                 = useState({ studentId: '', roomId: '', requestId: '' });
  const [msg, setMsg]                   = useState({ text: '', type: '' });
  const [loading, setLoading]           = useState(true);

  const fetchData = async () => {
    try {
      const [reqRes, roomRes, allocRes] = await Promise.all([getAllRequests(), getRooms(), getAllAllocations()]);
      setApprovedReqs(reqRes.data.filter(r => r.status === 'approved'));
      setRooms(roomRes.data.filter(r => r.isAvailable));
      setAllocations(allocRes.data.filter(a => a.isActive));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await allocateRoom(form);
      setMsg({ text: 'Room allocated successfully!', type: 'success' });
      setForm({ studentId: '', roomId: '', requestId: '' });
      fetchData();
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Error', type: 'danger' }); }
  };

  const handleVacate = async (id) => {
    if (!window.confirm('Mark this student as vacated?')) return;
    try {
      await vacateRoom(id);
      setMsg({ text: 'Room vacated.', type: 'info' });
      fetchData();
    } catch (err) { setMsg({ text: 'Error vacating room', type: 'danger' }); }
  };

  const handleReqSelect = (e) => {
    const req = approvedReqs.find(r => r._id === e.target.value);
    setForm({ ...form, requestId: e.target.value, studentId: req?.student?._id || '' });
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>;

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-house-add me-2"></i>Allocate Room</h3>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">Allocate a Room</div>
            <div className="card-body">
              {approvedReqs.length === 0 ? (
                <div className="alert alert-info py-2">No approved requests pending allocation.</div>
              ) : (
                <form onSubmit={handleAllocate}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Approved Request *</label>
                    <select className="form-select" value={form.requestId} onChange={handleReqSelect} required>
                      <option value="">Choose student request</option>
                      {approvedReqs.map(r => (
                        <option key={r._id} value={r._id}>
                          {r.student?.name} — {r.roomType} {r.preferredBlock ? `(${r.preferredBlock})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Select Available Room *</label>
                    <select className="form-select" value={form.roomId}
                      onChange={e => setForm({ ...form, roomId: e.target.value })} required>
                      <option value="">Choose a room</option>
                      {rooms.map(r => (
                        <option key={r._id} value={r._id}>
                          {r.roomNumber} — {r.hostelBlock} | {r.roomType} | Floor {r.floor} | {r.capacity - (r.occupiedBy?.length || 0)} beds left
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success w-100">
                    <i className="bi bi-house-check me-1"></i>Allocate Room
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <h5 className="mb-3"><i className="bi bi-list-check me-2"></i>Active Allocations ({allocations.length})</h5>
          {allocations.length === 0 ? (
            <div className="alert alert-info">No active allocations.</div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr><th>Student</th><th>Room</th><th>Block</th><th>Date</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {allocations.map(a => (
                      <tr key={a._id}>
                        <td><strong>{a.student?.name}</strong><br /><small className="text-muted">{a.student?.email}</small></td>
                        <td>{a.room?.roomNumber}</td>
                        <td>{a.room?.hostelBlock}</td>
                        <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleVacate(a._id)}>
                            <i className="bi bi-box-arrow-right"></i> Vacate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllocateRoom;
