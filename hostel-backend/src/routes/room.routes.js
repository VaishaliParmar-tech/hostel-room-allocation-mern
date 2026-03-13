const express = require('express');
const router = express.Router();
const { getRooms, getAvailableRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/room.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/available', protect, getAvailableRooms);
router.get('/',          protect, getRooms);
router.get('/:id',       protect, getRoomById);
router.post('/',         protect, authorize('admin'), createRoom);
router.put('/:id',       protect, authorize('admin', 'warden'), updateRoom);
router.delete('/:id',    protect, authorize('admin'), deleteRoom);

module.exports = router;
