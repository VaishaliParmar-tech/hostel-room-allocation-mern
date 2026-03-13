import { useState, useEffect } from 'react';
import { getMyAllocation } from '../../services/api.service';
import { Link } from 'react-router-dom';

const MyAllocation = () => {
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getMyAllocation()
      .then(res => setAllocation(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <h3><i className="bi bi-house me-2"></i>My Room Allocation</h3>
      {!allocation ? (
        <div className="card text-center py-5 mt-3">
          <div className="card-body">
            <i className="bi bi-door-closed fs-1 text-muted"></i>
            <h5 className="mt-3">No Room Allocated Yet</h5>
            <p className="text-muted">Your request may be pending or not yet submitted.</p>
            <Link to="/student/apply" className="btn btn-primary">Apply for Room</Link>
          </div>
        </div>
      ) : (
        <div className="card border-success shadow mt-3">
          <div className="card-header bg-success text-white">
            <i className="bi bi-house-check me-2"></i>Room Allocation Details
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr><td className="fw-bold text-muted">Room Number</td><td><h5 className="text-success mb-0">{allocation.room?.roomNumber}</h5></td></tr>
                    <tr><td className="fw-bold text-muted">Hostel Block</td><td>{allocation.room?.hostelBlock}</td></tr>
                    <tr><td className="fw-bold text-muted">Room Type</td><td>{allocation.room?.roomType}</td></tr>
                    <tr><td className="fw-bold text-muted">Floor</td><td>Floor {allocation.room?.floor}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr><td className="fw-bold text-muted">Capacity</td><td>{allocation.room?.capacity} persons</td></tr>
                    <tr><td className="fw-bold text-muted">Allocated By</td><td>{allocation.allocatedBy?.name}</td></tr>
                    <tr><td className="fw-bold text-muted">Allocation Date</td><td>{new Date(allocation.createdAt).toLocaleDateString()}</td></tr>
                    <tr><td className="fw-bold text-muted">Status</td><td><span className="badge bg-success">Active</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAllocation;
