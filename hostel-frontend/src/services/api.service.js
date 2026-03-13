import API from '../api/axios';

// Room services
export const getRooms         = ()       => API.get('/rooms');
export const getAvailableRooms= ()       => API.get('/rooms/available');
export const createRoom       = (data)   => API.post('/rooms', data);
export const updateRoom       = (id, d)  => API.put(`/rooms/${id}`, d);
export const deleteRoom       = (id)     => API.delete(`/rooms/${id}`);

// Request services
export const getMyRequests    = ()       => API.get('/requests/my');
export const getAllRequests    = ()       => API.get('/requests');
export const submitRequest    = (data)   => API.post('/requests', data);
export const approveRequest   = (id, r)  => API.put(`/requests/${id}/approve`, { remarks: r });
export const rejectRequest    = (id, r)  => API.put(`/requests/${id}/reject`, { remarks: r });
export const cancelRequest    = (id)     => API.delete(`/requests/${id}`);

// Allocation services
export const getAllAllocations = ()       => API.get('/allocations');
export const getMyAllocation   = ()       => API.get('/allocations/my');
export const allocateRoom      = (data)   => API.post('/allocations', data);
export const vacateRoom        = (id)     => API.put(`/allocations/${id}/vacate`);
export const getReport         = ()       => API.get('/allocations/report');

// Admin services
export const getStudents  = ()      => API.get('/admin/students');
export const getWardens   = ()      => API.get('/admin/wardens');
export const addWarden    = (data)  => API.post('/admin/warden', data);
export const deleteUser   = (id)    => API.delete(`/admin/users/${id}`);
