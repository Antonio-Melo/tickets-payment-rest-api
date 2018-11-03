const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcryptjs');
const usersModel = require('../database/schemas/users');

passport.use(new passportLocal.Strategy(
  (username, password, done) => usersModel.findOne({ username })
    .then(
      user => {
        if (!user)
          return done(null, false);
        return bcrypt.compare(password, user.passwordHashed, (err, result) => {
          if (!result)
            return done(null, false, { message: 'Incorrect password.' });
          return done(null, user);
        });
      }
    ).catch(err => console.debug(err))
));

module.exports = passport;
