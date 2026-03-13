const express = require('express');
const router = express.Router();
const { getAllRequests, getMyRequests, createRequest, approveRequest, rejectRequest, cancelRequest } = require('../controllers/request.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/',               protect, authorize('warden', 'admin'), getAllRequests);
router.get('/my',             protect, authorize('student'), getMyRequests);
router.post('/',              protect, authorize('student'), createRequest);
router.put('/:id/approve',    protect, authorize('warden', 'admin'), approveRequest);
router.put('/:id/reject',     protect, authorize('warden', 'admin'), rejectRequest);
router.delete('/:id',         protect, authorize('student'), cancelRequest);

module.exports = router;
