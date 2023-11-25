// requireAuth.js
const jwt = require('jsonwebtoken');
const Users = require('../models/usersModel');
const secretKey = 'adminmanageromaragtib';

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, secretKey);

    req.user = await Users.findOne({ _id }).select('_id');
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token expired, try to refresh it
      const refreshToken = req.headers['refresh-token'];

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is missing' });
      }

      try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const { _id } = decoded;

        const user = await Users.findOne({ _id }).select('_id');

        // Generate a new access token
        const newAccessToken = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '30s' });

        // Attach the newAccessToken to the response headers
        res.setHeader('Authorization', 'Bearer ' + newAccessToken);

        // Continue with the request
        next();
      } catch (refreshError) {
        console.log(refreshError);
        return res.status(401).json({ error: 'Refresh token is invalid' });
      }
    } else {
      console.log(error);
      res.status(401).json({ error: 'Request is not authorized' });
    }
  }
};

module.exports = requireAuth;
