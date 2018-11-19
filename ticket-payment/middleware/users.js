const CreditCard = require('credit-card');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const usersModel = require('../database/schemas/users');

/* Verify user */
exports.decodeAndVerifyUser = (req, res, next) => {
  const encondedMessage = req.body.message;
  const payload = jwt.decode(encondedMessage);
  const uuid = payload.uuid;

  usersModel.findOne({ uuid })
    .then(
      user => {
        if(!user)
          return res.status(403).json({ message: 'Unauthorized' });

        const publicKey = user.publicKey;
        const verifyOptions = { 'algorithms': ['RS256']};
        jwt.verify(encondedMessage, publicKey, verifyOptions, (error, decoded) => {
          if(error)
            return res.status(403).json({ message: 'Unauthorized'});

          req.payload = payload;
          req.payload.userId = user._id;
          req.payload.username = user.username;
          return next();
        });
      }
    ).catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};

/* Get user id from uuid */
exports.getUserIdfromUUID = (req, res, next) => {
  if(req.method === 'GET')
    uuid = req.query.uuid;
  if(req.method === 'POST')
    uuid = req.body.uuid;

  usersModel.findOne({ uuid })
    .then(
      user => {
        if(!user)
          return res.status(403).json({ message: 'Unauthorized' });

        req.userId = user._id;
        return next();
      }
    ).catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};

/* Check if user already exists */
exports.checkIfUserAlreadyExists = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;

  usersModel.findOne({ $or: [{'username': username}, {'email': email}] })
    .then(
      (err, user) => {
        if (err || user)
          return res.status(403).json({ message: 'A user is already created with this username'});
        return next();
      }
    ).catch(err => res.status(500).json({ message: 'Error getting data from the database' }));
};

/* Validate User data before saving in the database */
exports.validateUserData = (req, res, next) => {
  const userData = req.body;
  let userDataToSend = {};

  /* Validate username */
  const regexUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  if (!regexUsername.test(userData.username)) {
    return res.status(400).json({ message: 'Invalid username data' });
  }

  /* Validate name */
  const regexName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  if(!regexName.test(userData.name)) {
    return res.status(400).json({ message: 'Invalid name data' });
  }

  /* Validate password */
  const regexPassword = /^(?=.*\d).{4,25}$/;
  if(!regexPassword.test(userData.password)) {
    return res.status(400).json({ message: 'Invalid password data' });
  }

  /* Validate NIF */
  const regexNif = /^[0-9]{9}$/;
  if(!regexNif.test(userData.nif)) {
    return res.status(400).json({ message: 'Invalid nif data' });
  }

  /* Validate email */
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!regexEmail.test(userData.email)) {
    return res.status(400).json({ message: 'Invalid email data' });
  }

  /* Validate credit card */
  /*const validationCard = CreditCard.validate(userData.creditCard);
  if(!validationCard.validCardNumber || !validationCard.validExpiryMonth ||
  !validationCard.validExpiryYear || !validationCard.validCvv || validationCard.isExpired) {
    console.log('entrei credit card');
    return res.status(400).json({ message: 'Invalid credit card data' });
  }*/

  // Create validity Date from month and year
  const validityMonth = parseInt(userData.creditCard.expiryMonth)-1;
  const validityYear = parseInt(userData.creditCard.expiryYear);
  userData.creditCard.validity = new Date(validityYear, validityMonth, 1, 0, 0, 0, 0);
  delete userData['creditCard']['expiryMonth'];
  delete userData['creditCard']['expiryYear'];

  req.userData = userData;
  next();
};

/* Generate uuid */
exports.generateUUID = (req, res, next) => {
  req.userData.uuid = uuidv4();
  next();
};

/* Save user in the database */
exports.registerUserInDB = (req, res, next) =>{
  const newUser = new usersModel(req.userData);

  newUser.save(err => {
    if(err) {
      return res.status(500).json({ message: 'Error adding user to db' });
    }
    return res.status(200).json({ 'uuid': req.userData.uuid });
  });
};

exports.saveNewPublicKey = (req, res, next) => {
  const publicKey = req.body.publicKey;
  const user = req.user;
  if(publicKey)
    usersModel.findById(user._id).then(user => {
      user.publicKey = publicKey;
      user.save(() => res.status(200).json({ username: user.username, name: user.name, email: user.email, uuid: user.uuid }));
    });
  else
    return res.status(200).json({ username: user.username, name: user.name, email: user.email, uuid: user.uuid });
};
