import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllRequests, getAllAllocations, getRooms } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';

const WardenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, approved: 0, rooms: 0, allocations: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, allocRes, roomsRes] = await Promise.all([
          getAllRequests(), getAllAllocations(), getRooms()
        ]);
        const requests = reqRes.data;
        setRecentRequests(requests.slice(0, 5));
        setStats({
          pending: requests.filter(r => r.status === 'pending').length,
          approved: requests.filter(r => r.status === 'approved').length,
          rooms: roomsRes.data.length,
          allocations: allocRes.data.filter(a => a.isActive).length,
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-person-badge me-2"></i>Warden Dashboard</h3>
        <p className="text-muted">Welcome, <strong>{user?.name}</strong></p>
      </div>
      <div className="row g-3 mb-4">
        {[
          { label: 'Pending Requests', value: stats.pending, color: 'warning', icon: 'clock', link: '/warden/requests' },
          { label: 'Approved', value: stats.approved, color: 'success', icon: 'check-circle', link: '/warden/requests' },
          { label: 'Total Rooms', value: stats.rooms, color: 'info', icon: 'door-open', link: '/warden/rooms' },
          { label: 'Active Allocations', value: stats.allocations, color: 'primary', icon: 'house-check', link: '/warden/allocate' },
        ].map(s => (
          <div className="col-md-3" key={s.label}>
            <div className={`card border-${s.color} text-center h-100`}>
              <div className="card-body">
                <i className={`bi bi-${s.icon} fs-2 text-${s.color}`}></i>
                <h2 className={`text-${s.color}`}>{s.value}</h2>
                <p className="mb-2 small">{s.label}</p>
                <Link to={s.link} className={`btn btn-sm btn-outline-${s.color}`}>View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span><i className="bi bi-clock-history me-2"></i>Recent Requests</span>
          <Link to="/warden/requests" className="btn btn-sm btn-outline-success">View All</Link>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr><th>Student</th><th>Email</th><th>Room Type</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recentRequests.map(req => (
                <tr key={req._id}>
                  <td>{req.student?.name}</td>
                  <td>{req.student?.email}</td>
                  <td>{req.roomType}</td>
                  <td>
                    <span className={`badge bg-${{ pending:'warning',approved:'success',rejected:'danger',allocated:'primary' }[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;
