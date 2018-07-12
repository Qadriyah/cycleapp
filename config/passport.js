const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const MemberSchema = require("../models/Member");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretKey;

module.exports = passport => {
  // Use the new JwtStrategy
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      MemberSchema.findById(jwt_payload.uid)
        .then(member => {
          if (member) {
            return done(null, member);
          } else {
            return done(null, false);
          }
        })
        .catch(err => console.log(err));
    })
  );
};
