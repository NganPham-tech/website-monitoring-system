const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Xác thực tất cả route đều phải Login
router.use(authMiddleware);

// Các endpoint theo chuần REST
router.get('/', maintenanceController.getAll);
router.post('/', maintenanceController.create);
router.put('/:id', maintenanceController.update);
router.delete('/:id', maintenanceController.remove);

module.exports = router;
