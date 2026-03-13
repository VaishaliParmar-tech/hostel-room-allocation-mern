const express = require('express');
const router = express.Router();
const { getAllAllocations, getMyAllocation, allocateRoom, vacateRoom, getReport } = require('../controllers/allocation.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/report', protect, authorize('admin', 'warden'), getReport);
router.get('/my',     protect, authorize('student'), getMyAllocation);
router.get('/',       protect, authorize('admin', 'warden'), getAllAllocations);
router.post('/',      protect, authorize('warden'), allocateRoom);
router.put('/:id/vacate', protect, authorize('warden', 'admin'), vacateRoom);

module.exports = router;
