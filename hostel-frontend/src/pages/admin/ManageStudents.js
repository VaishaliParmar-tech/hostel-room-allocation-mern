import { useState, useEffect } from 'react';
import { getStudents, deleteUser } from '../../services/api.service';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState('');
  const [search, setSearch]     = useState('');

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student ${name}?`)) return;
    try {
      await deleteUser(id);
      setMsg(`Student "${name}" deleted.`);
      fetchStudents();
    } catch (err) { setMsg('Error deleting student'); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3><i className="bi bi-people me-2"></i>Manage Students ({students.length})</h3>
      </div>
      {msg && <div className="alert alert-info py-2">{msg}</div>}
      <div className="mb-3">
        <input className="form-control" placeholder="Search by name or email..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr><th>#</th><th>Name</th><th>Email</th><th>Contact</th><th>Registered</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-4 text-muted">No students found.</td></tr>
              )}
              {filtered.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td><i className="bi bi-person-circle me-1 text-primary"></i>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.contactNumber || '—'}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id, s.name)}>
                      <i className="bi bi-trash"></i> Delete
                    </button>
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

export default ManageStudents;
