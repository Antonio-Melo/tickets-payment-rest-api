const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const creditCardSchema = mongoose.Schema({
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
});

/* Hash credit card number */
creditCardSchema.virtual('number').set(function (creditCardNumber) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let creditCardNumberCrypted = cipher.update(creditCardNumber, 'utf8', 'hex');
  creditCardNumberCrypted += cipher.final('hex');
  this.numberHashed = creditCardNumberCrypted;
});

creditCardSchema.virtual('number').get(function () {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let decriptedcreditCardNumber = decipher.update(this.numberHashed, 'hex', 'utf8');
  decriptedcreditCardNumber += decipher.final('utf8');
  return decriptedcreditCardNumber;
});

/* Hash credit card cvv */
creditCardSchema.virtual('cvv').set(function (creditCardCvv) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let creditCardCvvCrypted = cipher.update(creditCardCvv, 'utf8', 'hex');
  creditCardCvvCrypted += cipher.final('hex');
  this.cvvHashed = creditCardCvvCrypted;
});

creditCardSchema.virtual('cvv').get(function () {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let decriptedcreditCardCvv = decipher.update(this.cvvHashed, 'hex', 'utf8');
  decriptedCreditCardCvv += decipher.final('utf8');
  return decriptedCreditCardCvv;
});

const usersSchema = mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
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
  publicKeyHashed: {
    type: String,
    required: true
  },
  creditCard: creditCardSchema,
  updated_at: { type: Date, default: Date.now }
}, { collection: 'users' });

usersSchema.pre('save', function(next) {
  const user = this;

  if(user.isModified('password')){
    const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_HASH_ROUNDS, 10));
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  }
  return next();
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

/* Hash public key and decript */
usersSchema.virtual('publicKey').set(function (key) {
  console.log('ESTOU AQUI MALUCOS');
  const cipher = crypto.createCipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let keyCrypted = cipher.update(key, 'utf8', 'hex');
  keyCrypted += cipher.final('hex');
  this.publicKeyHashed = keyCrypted;
});

usersSchema.virtual('publicKey').get(function (key){
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.CRYPTO_SECRET);
  let decriptedKey = decipher.update(this.publicKeyHashed, 'hex', 'utf8');
  decriptedKey += decipher.final('utf8');
  return decriptedKey;
});

const usersModel = mongoose.model('user', usersSchema);
module.exports = usersModel;
