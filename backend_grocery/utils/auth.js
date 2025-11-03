const jwt = require('jsonwebtoken');

function generateToken(id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1d' });
}

module.exports = { generateToken };
