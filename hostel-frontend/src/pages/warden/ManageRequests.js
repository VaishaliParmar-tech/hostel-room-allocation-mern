import { useState, useEffect } from 'react';
import { getAllRequests, approveRequest, rejectRequest } from '../../services/api.service';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState({ text: '', type: '' });
  const [remarks, setRemarks]   = useState({});

  const fetchRequests = async () => {
    try {
      const res = await getAllRequests();
      setRequests(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveRequest(id, remarks[id] || 'Approved');
      setMsg({ text: 'Request approved!', type: 'success' });
      fetchRequests();
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Error', type: 'danger' }); }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id, remarks[id] || 'Rejected');
      setMsg({ text: 'Request rejected.', type: 'warning' });
      fetchRequests();
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Error', type: 'danger' }); }
  };

  const badge = { pending: 'warning', approved: 'success', rejected: 'danger', allocated: 'primary' };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>;

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-clipboard-check me-2"></i>Manage Room Requests</h3>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
      <div className="card shadow-sm mt-3">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr><th>#</th><th>Student</th><th>Contact</th><th>Room Type</th><th>Block</th><th>Status</th><th>Remarks / Action</th></tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-muted">No requests found.</td></tr>
              )}
              {requests.map((req, i) => (
                <tr key={req._id}>
                  <td>{i + 1}</td>
                  <td><strong>{req.student?.name}</strong><br /><small className="text-muted">{req.student?.email}</small></td>
                  <td>{req.student?.contactNumber || '—'}</td>
                  <td>{req.roomType}</td>
                  <td>{req.preferredBlock || '—'}</td>
                  <td><span className={`badge bg-${badge[req.status]}`}>{req.status}</span></td>
                  <td>
                    {req.status === 'pending' ? (
                      <div>
                        <input className="form-control form-control-sm mb-1" placeholder="Add remarks (optional)"
                          value={remarks[req._id] || ''}
                          onChange={e => setRemarks({ ...remarks, [req._id]: e.target.value })} />
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(req._id)}>
                            <i className="bi bi-check"></i> Approve
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(req._id)}>
                            <i className="bi bi-x"></i> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted small">{req.wardenRemarks || '—'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;
