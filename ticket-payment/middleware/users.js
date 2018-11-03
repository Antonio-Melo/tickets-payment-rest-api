const CreditCard = require('credit-card');
const usersModel = require('../database/schemas/users');

/* Validate User data before saving in the database */
exports.validateUserData = (req, res, next) => {
  const userData = req.body;
  let userDataToSend = {};

  /* Validate username */
  const regexUsername = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  if (!regexUsername.test(userData.username))
    return res.status(400).json({ message: 'Invalid data' });
  userDataToSend.username = userData.username;

  /* Validate name */
  const regexName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  if(!regexName.test(userData.name))
    return res.status(400).json({ message: 'Invalid data' });
  userDataToSend.name = userData.name;

  /* Validate password */
  const regexPassword = /^(?=.*\d).{4,25}$/;
  if(!regexPassword.test(userData.password))
    return res.status(400).json({ message: 'Invalid data' });
  userDataToSend.password = userData.password;

  /* Validate NIF */
  const regexNif = /^[0-9]{9}$/;
  if(!regexNif.test(userData.nif))
    return res.status(400).json({ message: 'Invalid data' });
  userDataToSend.nif = userData.nif;

  /* Validate email */
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!regexEmail.test(userData.email))
    return res.status(400).json({ message: 'Invalid data' });
  userDataToSend.email = userData.email;

  /* Validate credit card */
  const validationCard = CreditCard.validate(userData.creditCard);
  if(!validationCard.validCardNumber || !validationCard.validExpiryMonth ||
  !validationCard.validExpiryYear || !validationCard.validCvv || validationCard.isExpired)
    return res.status(400).json({ message: 'Invalid data' });
  userDataToSend.cardType = userData.creditCard.cardType;
  userDataToSend.number = userData.creditCard.number;
  userDataToSend.cvv = userData.creditCard.cvv;
  // Create validity Date from month and year
  const validityMonth = parseInt(userData.creditCard.expiryMonth)-1;
  const validityYear = parseInt(userData.creditCard.expiryYear);
  userDataToSend.validity = new Date(validityYear, validityMonth, 1, 0, 0, 0, 0);

  req.userData = userDataToSend;
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
      return res.sendStatus(204);
  });
};
