// Middleware to check user roles (admin and manager)
const jwt = require('jsonwebtoken');
const checkRoles = (req, res, next) => {
  const secretKey = 'adminmanageromaragtib';
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const { role } = decoded;

    if (role === 'Admin') {
      next();
    } else {
      return res.status(403).json({
        message: 'Access denied. Only admin  roles allowed.',
      });
    }
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
module.exports = checkRoles;
