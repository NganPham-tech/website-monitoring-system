const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', apiKeyController.getApiKeys);
router.post('/', apiKeyController.createApiKey);
router.delete('/:id', apiKeyController.deleteApiKey);

module.exports = router;
