const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHashed: {
    type: String,
    required: true
  },
  nifHashed: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  creditCard: {
    cardType:{
      type: String,
      required: true
    },
    numberHashed: {
      type: String,
      required: true
    },
    cvvHashed: {
      type: String,
      required: true
    },
    validity:{
      type: Date,
      required: true
    }
  },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'users' });

/* Hash password */
usersSchema.virtual('password').set(function (password) {
  const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_HASH_ROUNDS, 10));
  const hash = bcrypt.hashSync(password, salt);
  this.passwordHashed = hash;
});

/* Hash nif and decipher nif */
usersSchema.virtual('nif').set(function (nif) {
  const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_HASH_ROUNDS, 10));
  const hash = bcrypt.hashSync(nif, salt);
  this.nifHashed = hash;
});

/* Hash credit card number */
usersSchema.virtual('number').set(function (creditCardNumber) {
  const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_HASH_ROUNDS, 10));
  const hash = bcrypt.hashSync(creditCardNumber, salt);
  this.creditCard.numberHashed = hash;
});

usersSchema.virtual('number').get(function () {
  return this.creditCard.numberHashed;
});

/* Hash credit card cvv */
usersSchema.virtual('cvv').set(function (creditCardCvv) {
  const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_HASH_ROUNDS, 10));
  const hash = bcrypt.hashSync(creditCardCvv, salt);
  this.creditCard.cvvHashed = hash;
});

usersSchema.virtual('cvv').get(function () {
  return this.creditCard.cvvHashed;
});

/* */
usersSchema.virtual('cardType').set(function (cardType) {
  this.creditCard.cardType = cardType;
});

usersSchema.virtual('cardType').get(function () {
  return this.creditCard.cardType;
});

/**/
usersSchema.virtual('validity').set(function (validity) {
  this.creditCard.validity = validity;
});

usersSchema.virtual('cardType').get(function () {
  return this.creditCard.validity;
});

const usersModel = mongoose.model('user', usersSchema);
module.exports = usersModel;
