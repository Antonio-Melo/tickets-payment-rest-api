/* jshint node: true */
const mongoose = require('mongoose');
const bluebird = require('bluebird');

exports.connect = () => {
  // Connection ready state
  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  const connected = mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
  console.log('Connection Status:', connected);

  if (!connected) {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connection open');
    });

    // If the connection throws an error
    mongoose.connection.on('error', err => {
      console.log(`Mongoose connection error: ${err}`);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection disconnected');
    });

    return mongoose.connect(process.env.MONGO_URI,
      { useNewUrlParser: true });
  }

  return bluebird.resolve();
};
