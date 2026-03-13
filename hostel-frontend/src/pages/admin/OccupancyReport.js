import { useState, useEffect } from 'react';
import { getReport, getAllAllocations } from '../../services/api.service';

const OccupancyReport = () => {
  const [report, setReport]         = useState({});
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getReport(), getAllAllocations()])
      .then(([r, a]) => { setReport(r.data); setAllocations(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

  const occupancyPct = report.totalRooms
    ? Math.round((report.occupiedRooms / report.totalRooms) * 100)
    : 0;

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-graph-up me-2"></i>Occupancy Report</h3>
      <p className="text-muted">Real-time overview of hostel occupancy</p>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Rooms', value: report.totalRooms, color: 'primary', icon: 'building' },
          { label: 'Occupied Rooms', value: report.occupiedRooms, color: 'danger', icon: 'lock' },
          { label: 'Available Rooms', value: report.availableRooms, color: 'success', icon: 'unlock' },
          { label: 'Active Allocations', value: report.activeAllocations, color: 'warning', icon: 'house-check' },
          { label: 'Pending Requests', value: report.pendingRequests, color: 'info', icon: 'hourglass' },
        ].map(c => (
          <div className="col-md" key={c.label}>
            <div className={`card border-${c.color} text-center`}>
              <div className="card-body py-3">
                <i className={`bi bi-${c.icon} fs-2 text-${c.color}`}></i>
                <h2 className={`text-${c.color}`}>{c.value}</h2>
                <small className="fw-semibold">{c.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-4">
        <div className="card-header"><i className="bi bi-bar-chart me-2"></i>Occupancy Rate</div>
        <div className="card-body">
          <div className="d-flex justify-content-between mb-1">
            <span>Rooms Occupied</span>
            <strong>{occupancyPct}%</strong>
          </div>
          <div className="progress" style={{ height: '25px' }}>
            <div
              className={`progress-bar bg-${occupancyPct > 80 ? 'danger' : occupancyPct > 50 ? 'warning' : 'success'}`}
              style={{ width: `${occupancyPct}%` }}
            >
              {occupancyPct}%
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><i className="bi bi-table me-2"></i>All Allocations ({allocations.length})</div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr><th>#</th><th>Student</th><th>Room</th><th>Block</th><th>Type</th><th>Allocated On</th><th>Status</th></tr>
            </thead>
            <tbody>
              {allocations.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-muted">No allocations yet.</td></tr>
              )}
              {allocations.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td>{a.student?.name}<br /><small className="text-muted">{a.student?.email}</small></td>
                  <td>{a.room?.roomNumber}</td>
                  <td>{a.room?.hostelBlock}</td>
                  <td>{a.room?.roomType}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${a.isActive ? 'success' : 'secondary'}`}>
                      {a.isActive ? 'Active' : 'Vacated'}
                    </span>
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

export default OccupancyReport;
