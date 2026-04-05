const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Chỉ User đã Login mới có quyền truy cập
router.use(authMiddleware);

router.get('/', integrationController.getAll);
router.post('/', integrationController.save);
router.delete('/:id', integrationController.remove);

module.exports = router;
