const CreditCard = require('credit-card');
const uuidv4 = require('uuid/v4');
const usersModel = require('../database/schemas/users');

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
    );
};

/* Validate User data before saving in the database */
exports.validateUserData = (req, res, next) => {
  const userData = req.body;
  let userDataToSend = {};

  /* Validate username */
  const regexUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  if (!regexUsername.test(userData.username))
    return res.status(400).json({ message: 'Invalid data' });

  /* Validate name */
  const regexName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  if(!regexName.test(userData.name))
    return res.status(400).json({ message: 'Invalid data' });

  /* Validate password */
  const regexPassword = /^(?=.*\d).{4,25}$/;
  if(!regexPassword.test(userData.password))
    return res.status(400).json({ message: 'Invalid data' });

  /* Validate NIF */
  const regexNif = /^[0-9]{9}$/;
  if(!regexNif.test(userData.nif))
    return res.status(400).json({ message: 'Invalid data' });

  /* Validate email */
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!regexEmail.test(userData.email))
    return res.status(400).json({ message: 'Invalid data' });

  /* Validate credit card */
  const validationCard = CreditCard.validate(userData.creditCard);
  if(!validationCard.validCardNumber || !validationCard.validExpiryMonth ||
  !validationCard.validExpiryYear || !validationCard.validCvv || validationCard.isExpired)
    return res.status(400).json({ message: 'Invalid data' });

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
    if(err){
      console.log({err});
      return res.status(500).json({ message: 'Error adding user to db' });
    }
    else
      return res.status(200).json({ 'uuid': req.userData.uuid });
  });
};

/* Get tickets related to a user */
exports.getUserTickets = (req, res, next) => {

};
