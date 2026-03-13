import { useState, useEffect } from 'react';
import { getWardens, addWarden, deleteUser } from '../../services/api.service';

const ManageWardens = () => {
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ name: '', email: '', password: '', contactNumber: '' });

  const fetchWardens = async () => {
    try { const res = await getWardens(); setWardens(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWardens(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addWarden(form);
      setMsg({ text: 'Warden added successfully!', type: 'success' });
      setForm({ name: '', email: '', password: '', contactNumber: '' });
      setShowForm(false);
      fetchWardens();
    } catch (err) { setMsg({ text: err.response?.data?.message || 'Error', type: 'danger' }); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete warden ${name}?`)) return;
    try {
      await deleteUser(id);
      setMsg({ text: `Warden "${name}" deleted.`, type: 'info' });
      fetchWardens();
    } catch (err) { setMsg({ text: 'Error deleting warden', type: 'danger' }); }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3><i className="bi bi-person-badge me-2"></i>Manage Wardens ({wardens.length})</h3>
        <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-circle me-1"></i>{showForm ? 'Cancel' : 'Add Warden'}
        </button>
      </div>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {showForm && (
        <div className="card mb-4 border-success">
          <div className="card-header bg-success text-white">Add New Warden</div>
          <div className="card-body">
            <form onSubmit={handleAdd}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Full Name *" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control" placeholder="Email *" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <input type="password" className="form-control" placeholder="Password *" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Contact Number" value={form.contactNumber}
                    onChange={e => setForm({ ...form, contactNumber: e.target.value })} />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-success">Add Warden</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr><th>#</th><th>Name</th><th>Email</th><th>Contact</th><th>Added On</th><th>Action</th></tr>
            </thead>
            <tbody>
              {wardens.length === 0 && (
                <tr><td colSpan={6} className="text-center py-4 text-muted">No wardens found.</td></tr>
              )}
              {wardens.map((w, i) => (
                <tr key={w._id}>
                  <td>{i + 1}</td>
                  <td><i className="bi bi-person-badge me-1 text-success"></i>{w.name}</td>
                  <td>{w.email}</td>
                  <td>{w.contactNumber || '—'}</td>
                  <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(w._id, w.name)}>
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

export default ManageWardens;
