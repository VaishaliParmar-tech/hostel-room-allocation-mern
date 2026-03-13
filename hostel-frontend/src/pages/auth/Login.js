import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'warden') navigate('/warden/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '420px' }}>
        <div className="card-header bg-primary text-white text-center py-4">
          <i className="bi bi-building fs-1 d-block"></i>
          <h4 className="mb-0 mt-2">Hostel Room Allocation</h4>
          <small>Login to your account</small>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input type="email" name="email" className="form-control" placeholder="Enter email"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" name="password" className="form-control" placeholder="Enter password"
                value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</> : 'Login'}
            </button>
          </form>
          <hr />
          <p className="text-center mb-0">
            New student? <Link to="/register">Register here</Link>
          </p>
          <div className="mt-3 p-2 bg-light rounded small text-muted">
            <strong>Demo credentials:</strong><br />
            Admin: admin@hostel.com / admin123<br />
            Warden: warden@hostel.com / warden123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
