const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.delete('/', profileController.deleteAccount);

router.put('/password', profileController.changePassword);

router.get('/notifications', profileController.getNotificationSettings);
router.put('/notifications', profileController.updateNotificationSettings);

router.get('/billing', profileController.getBillingInfo);

router.post('/2fa/enable', profileController.generate2FA);
router.post('/2fa/verify', profileController.verify2FA);

module.exports = router;
