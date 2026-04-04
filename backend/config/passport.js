const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authService = require('../services/authService');

// ====================== GOOGLE OAUTH ======================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { user } = await authService.handleSSOLogin(profile, 'google');
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ====================== GITHUB OAUTH ======================
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'dummy_id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_secret',
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tương tự, gọi handleSSOLogin cho Github. Profile trả về cấu trúc tương tự cần bóc tách.
        const { user } = await authService.handleSSOLogin(profile, 'github');
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Mặc dù ta dùng JWT là API không có sessions, ta không cần dùng passport.serializeUser()
// Tuy nhiên vì 1 số thư viện gọi middleware check cần có cái này giả để override:
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
