const jwt = require('jsonwebtoken');
secretKey = 'your-secret-key';

const isAuthCustomer = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, secretKey, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.customer = decode;
        // console.log(req.customer)
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
module.exports = isAuthCustomer
