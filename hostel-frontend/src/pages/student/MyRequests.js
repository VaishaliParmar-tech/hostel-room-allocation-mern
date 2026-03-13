import { useState, useEffect } from 'react';
import { getMyRequests, cancelRequest } from '../../services/api.service';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState('');

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      setRequests(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this request?')) return;
    try {
      await cancelRequest(id);
      setMsg('Request cancelled.');
      fetchRequests();
    } catch (err) { setMsg(err.response?.data?.message || 'Error cancelling'); }
  };

  const badge = { pending: 'warning', approved: 'success', rejected: 'danger', allocated: 'primary' };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-list-ul me-2"></i>My Room Requests</h3>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      {requests.length === 0 ? (
        <div className="alert alert-info mt-3">You have no room requests yet.</div>
      ) : (
        <div className="card shadow-sm mt-3">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th><th>Room Type</th><th>Preferred Block</th>
                  <th>Status</th><th>Remarks</th><th>Date</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <tr key={req._id}>
                    <td>{i + 1}</td>
                    <td>{req.roomType}</td>
                    <td>{req.preferredBlock || '—'}</td>
                    <td><span className={`badge bg-${badge[req.status]}`}>{req.status}</span></td>
                    <td>{req.wardenRemarks || '—'}</td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      {req.status === 'pending' && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(req._id)}>
                          <i className="bi bi-x-circle"></i> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
