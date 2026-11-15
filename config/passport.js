const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Ne koristimo passport session (req.session.customerId je nas vlastiti
// mehanizam, isti kao za email/lozinka prijavu) - passport ovdje samo
// odradi OAuth "handshake" i preda nam profil u callback rutu.
if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${APP_URL}/nalog/google/callback`,
        state: true
      },
      (accessToken, refreshToken, profile, done) => done(null, profile)
    )
  );
}

module.exports = { passport, googleConfigured };
