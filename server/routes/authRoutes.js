const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { rateLimitLogin, rateLimitRegister } = require('../../backend/middlewares/rateLimiter');

const router = express.Router();

// ================== Local Registration ==================
router.post('/register', rateLimitRegister, authController.register);

// ================== Local Login ==================
// Add rate limiter just on local login brute force attempt
router.post('/login', rateLimitLogin, authController.login);

// Optional: Logout feature
router.post('/logout', authController.logout);

// ================== Google SSO ==================
router.get('/google', passport.authenticate('google', { session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  authController.ssoCallback
);

// ================== Github SSO ==================
router.get('/github', passport.authenticate('github', { session: false }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  authController.ssoCallback
);

module.exports = router;
