import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import User from '../models/User.js'; 

// Configure environment variables
dotenv.config();

// Options for JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Create JWT strategy
const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    // Find the user by ID from JWT payload
    const user = await User.findById(payload.id);
    
    if (user) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

// Initialize passport and use JWT strategy
const initializePassport = () => {
  passport.use(jwtStrategy);
};

export default initializePassport;