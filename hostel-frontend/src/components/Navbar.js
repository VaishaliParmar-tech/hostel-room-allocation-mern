import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = {
    student: [
      { to: '/student/dashboard', label: 'Dashboard' },
      { to: '/student/apply', label: 'Apply Room' },
      { to: '/student/requests', label: 'My Requests' },
      { to: '/student/allocation', label: 'My Room' },
    ],
    warden: [
      { to: '/warden/dashboard', label: 'Dashboard' },
      { to: '/warden/requests', label: 'Requests' },
      { to: '/warden/allocate', label: 'Allocate Room' },
      { to: '/warden/rooms', label: 'Rooms' },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/students', label: 'Students' },
      { to: '/admin/wardens', label: 'Wardens' },
      { to: '/admin/rooms', label: 'Rooms' },
      { to: '/admin/report', label: 'Reports' },
    ],
  };

  const roleColors = { student: 'primary', warden: 'success', admin: 'danger' };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-${roleColors[user?.role] || 'dark'}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-building me-2"></i>Hostel System
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto">
            {user && links[user.role]?.map(link => (
              <li className="nav-item" key={link.to}>
                <Link className="nav-link" to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
          {user && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-white">
                <i className="bi bi-person-circle me-1"></i>
                {user.name} <span className="badge bg-light text-dark">{user.role}</span>
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
