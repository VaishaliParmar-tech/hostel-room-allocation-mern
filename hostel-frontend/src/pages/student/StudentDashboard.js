import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyRequests, getMyAllocation } from '../../services/api.service';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests]     = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, allocRes] = await Promise.all([getMyRequests(), getMyAllocation()]);
        setRequests(reqRes.data);
        setAllocation(allocRes.data);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statusBadge = (status) => ({
    pending: 'warning', approved: 'success', rejected: 'danger', allocated: 'primary'
  }[status] || 'secondary');

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-speedometer2 me-2"></i>Student Dashboard</h3>
        <p className="text-muted">Welcome back, <strong>{user?.name}</strong>!</p>
      </div>

      {/* Status Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-primary h-100">
            <div className="card-body text-center">
              <i className="bi bi-send fs-1 text-primary"></i>
              <h5 className="mt-2">Total Requests</h5>
              <h2 className="text-primary">{requests.length}</h2>
              <Link to="/student/requests" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning h-100">
            <div className="card-body text-center">
              <i className="bi bi-clock fs-1 text-warning"></i>
              <h5 className="mt-2">Pending</h5>
              <h2 className="text-warning">{requests.filter(r => r.status === 'pending').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card h-100 ${allocation ? 'border-success' : 'border-secondary'}`}>
            <div className="card-body text-center">
              <i className={`bi bi-door-open fs-1 ${allocation ? 'text-success' : 'text-secondary'}`}></i>
              <h5 className="mt-2">Room Status</h5>
              <h5>{allocation ? <span className="text-success">Allocated</span> : <span className="text-secondary">Not Allocated</span>}</h5>
              {allocation && <Link to="/student/allocation" className="btn btn-sm btn-outline-success">View Room</Link>}
            </div>
          </div>
        </div>
      </div>

      {/* Current Room */}
      {allocation && (
        <div className="card mb-4 border-success">
          <div className="card-header bg-success text-white">
            <i className="bi bi-house-check me-2"></i>Your Allocated Room
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Room Number:</strong> {allocation.room?.roomNumber}</p>
                <p><strong>Block:</strong> {allocation.room?.hostelBlock}</p>
                <p><strong>Type:</strong> {allocation.room?.roomType}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Floor:</strong> {allocation.room?.floor}</p>
                <p><strong>Allocated By:</strong> {allocation.allocatedBy?.name}</p>
                <p><strong>Date:</strong> {new Date(allocation.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card mb-4">
        <div className="card-header"><i className="bi bi-lightning me-2"></i>Quick Actions</div>
        <div className="card-body d-flex gap-2 flex-wrap">
          <Link to="/student/apply" className="btn btn-primary">
            <i className="bi bi-plus-circle me-1"></i>Apply for Room
          </Link>
          <Link to="/student/requests" className="btn btn-outline-primary">
            <i className="bi bi-list-ul me-1"></i>My Requests
          </Link>
          <Link to="/student/allocation" className="btn btn-outline-success">
            <i className="bi bi-door-open me-1"></i>My Room
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="card-header"><i className="bi bi-clock-history me-2"></i>Recent Requests</div>
        <div className="card-body p-0">
          {requests.length === 0 ? (
            <div className="text-center py-4 text-muted">No requests yet. <Link to="/student/apply">Apply for a room</Link></div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Room Type</th><th>Preferred Block</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map(req => (
                  <tr key={req._id}>
                    <td>{req.roomType}</td>
                    <td>{req.preferredBlock || '—'}</td>
                    <td><span className={`badge bg-${statusBadge(req.status)}`}>{req.status}</span></td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
