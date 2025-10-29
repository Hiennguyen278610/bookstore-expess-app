import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CLIENT_CALLBACKURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        username: email,
        email: email,
        fullName: profile.displayName,
        password: null,
        phone: null
      });
    }
    done(null, user)
  }catch(err) {
    done(err, null)
  }
}));
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CLIENT_CALLBACKURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        username: email,
        email: email,
        fullName: profile.displayName || profile.username,
        password: null,
        phone: null,
      })
    }
    done(null, user)
  }catch(err) {
    done(err, null)
  }
}))
export default passport;