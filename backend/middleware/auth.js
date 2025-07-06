const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    console.log('🔐 Incoming token:', token);
    console.log('🗝️ Using secret:', process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('✅ Decoded payload:', decoded);

    req.user = decoded; // Should contain: { id, role, iat, exp }
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

module.exports = auth;
