const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  const cipher = crypto.createCipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let nifCrypted = cipher.update(nif, 'utf8', 'hex');
  nifCrypted += cipher.final('hex');
  this.nifHashed = nifCrypted;
});

usersSchema.virtual('nif').get(function () {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let decriptedNif = decipher.update(this.nifHashed, 'hex', 'utf8');
  decriptedNif += decipher.final('utf8');
  return decriptedNif;
});

/* Hash credit card number */
usersSchema.virtual('number').set(function (creditCardNumber) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let creditCardNumberCrypted = cipher.update(creditCardNumber, 'utf8', 'hex');
  creditCardNumberCrypted += cipher.final('hex');
  this.creditCard.numberHashed = creditCardNumberCrypted;
});

usersSchema.virtual('number').get(function () {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let decriptedcreditCardNumber = decipher.update(this.creditCard.numberHashed, 'hex', 'utf8');
  decriptedcreditCardNumber += decipher.final('utf8');
  return decriptedcreditCardNumber;
});

/* Hash credit card cvv */
usersSchema.virtual('cvv').set(function (creditCardCvv) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let creditCardCvvCrypted = cipher.update(creditCardCvv, 'utf8', 'hex');
  creditCardCvvCrypted += cipher.final('hex');
  this.creditCard.cvvHashed = creditCardCvvCrypted;
});

usersSchema.virtual('cvv').get(function () {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let decriptedcreditCardCvv = decipher.update(this.creditCard.cvvHashed, 'hex', 'utf8');
  decriptedCreditCardCvv += decipher.final('utf8');
  return decriptedCreditCardCvv;
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
