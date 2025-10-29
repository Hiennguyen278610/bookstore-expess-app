import dotenv from 'dotenv';

dotenv.config()

export const providers = {
  google: {
    authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
    tokenURL: 'https://oauth2.googleapis.com/token',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    profileURL: "https://www.googleapis.com/oauth2/v2/userinfo"
  },
  github: {
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: "https://github.com/login/oauth/access_token",
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    profileURL: "https://api.github.com/user"
  }
}