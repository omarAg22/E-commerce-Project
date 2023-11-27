const jwt = require('jsonwebtoken');

const generateToken = (costumer) => {
  const token = jwt.sign(
    {
      _id: costumer._id,
      first_name: costumer.first_name,
      last_name: costumer.last_name,
      email: costumer.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
