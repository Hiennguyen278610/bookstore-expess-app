import OAuth2Strategy from 'passport-oauth2';
import { providers } from './providers.js';
import axios from 'axios';
import User from '../models/User.js';
import passport from 'passport';

const createDynamicStranger = (providerName) => {
  const config = providers[providerName];
  return new OAuth2Strategy({
    authorizationURL: config.authorizationURL,
    tokenURL: config.tokenURL,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: `http://localhost:8080/api/v1/oauth2/callback/${providerName}`,
    passReqToCallback: true
  }, async (accessToken, refreshToken, params, profile, done) => {
    try {
      const { data } = await axios.get(config.profileURL, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      console.log('Data: ' + data);
      let user = await User.findOne({ username: data.id });
      if (!user) {
        user = await User.create(
          { username: data.id, email: data.email, fullName: data.name }
        );
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
Object.keys(providers).forEach(providerName => {
  passport.use(providerName, createDynamicStranger(providerName));
});
// cai nay bo deo hieu
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
export default passport;