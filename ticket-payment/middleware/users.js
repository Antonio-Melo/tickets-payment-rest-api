const usersModel = require('../database/schemas/users');

exports.checkUserDataRegister = (req, res, next) => {
  const userData = req.body;
  console.log(userData);
  const newUser = new usersModel(userData);

  newUser.save(err => {
    if(err)
      return res.status(500).json({ message: 'Error adding user to db' });
    else
      return res.sendStatus(204);
  });
};
