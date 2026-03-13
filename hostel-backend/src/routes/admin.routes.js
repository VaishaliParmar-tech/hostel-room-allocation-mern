const express = require('express');
const router = express.Router();
const { getStudents, getWardens, addWarden, updateUser, deleteUser } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/students',     protect, authorize('admin'), getStudents);
router.get('/wardens',      protect, authorize('admin'), getWardens);
router.post('/warden',      protect, authorize('admin'), addWarden);
router.put('/users/:id',    protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
