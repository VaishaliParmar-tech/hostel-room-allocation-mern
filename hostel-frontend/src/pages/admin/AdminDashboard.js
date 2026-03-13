import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, getWardens, getReport } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [report, setReport] = useState({});
  const [counts, setCounts] = useState({ students: 0, wardens: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudents(), getWardens(), getReport()])
      .then(([s, w, r]) => {
        setCounts({ students: s.data.length, wardens: w.data.length });
        setReport(r.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  const cards = [
    { label: 'Students', value: counts.students, color: 'primary', icon: 'people', link: '/admin/students' },
    { label: 'Wardens', value: counts.wardens, color: 'success', icon: 'person-badge', link: '/admin/wardens' },
    { label: 'Total Rooms', value: report.totalRooms || 0, color: 'info', icon: 'door-open', link: '/admin/rooms' },
    { label: 'Active Allocations', value: report.activeAllocations || 0, color: 'warning', icon: 'house-check', link: '/admin/report' },
    { label: 'Available Rooms', value: report.availableRooms || 0, color: 'success', icon: 'unlock', link: '/admin/rooms' },
    { label: 'Pending Requests', value: report.pendingRequests || 0, color: 'danger', icon: 'hourglass-split', link: '/admin/report' },
  ];

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h3><i className="bi bi-shield-check me-2"></i>Admin Dashboard</h3>
        <p className="text-muted">Welcome, <strong>{user?.name}</strong> — System Overview</p>
      </div>
      <div className="row g-3 mb-4">
        {cards.map(c => (
          <div className="col-md-4 col-6" key={c.label}>
            <div className={`card border-${c.color} text-center h-100`}>
              <div className="card-body">
                <i className={`bi bi-${c.icon} fs-2 text-${c.color}`}></i>
                <h2 className={`text-${c.color}`}>{c.value}</h2>
                <p className="mb-2 small fw-semibold">{c.label}</p>
                <Link to={c.link} className={`btn btn-sm btn-outline-${c.color}`}>Manage</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header bg-dark text-white"><i className="bi bi-lightning me-2"></i>Quick Actions</div>
        <div className="card-body d-flex gap-2 flex-wrap">
          <Link to="/admin/students" className="btn btn-primary"><i className="bi bi-people me-1"></i>Manage Students</Link>
          <Link to="/admin/wardens" className="btn btn-success"><i className="bi bi-person-badge me-1"></i>Manage Wardens</Link>
          <Link to="/admin/rooms" className="btn btn-info text-white"><i className="bi bi-door-open me-1"></i>Manage Rooms</Link>
          <Link to="/admin/report" className="btn btn-warning"><i className="bi bi-graph-up me-1"></i>View Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
