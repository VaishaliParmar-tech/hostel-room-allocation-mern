import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', contactNumber: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(formData);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '440px' }}>
        <div className="card-header bg-success text-white text-center py-4">
          <i className="bi bi-person-plus fs-1 d-block"></i>
          <h4 className="mb-0 mt-2">Student Registration</h4>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="Enter full name"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input type="email" name="email" className="form-control" placeholder="Enter email"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" name="password" className="form-control" placeholder="Min 6 characters"
                value={formData.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Contact Number</label>
              <input type="text" name="contactNumber" className="form-control" placeholder="Phone number (optional)"
                value={formData.contactNumber} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Registering...</> : 'Register'}
            </button>
          </form>
          <hr />
          <p className="text-center mb-0">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
