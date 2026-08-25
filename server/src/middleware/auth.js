const { getDb } = require('../data/store');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const db = getDb();
  if (token && db.sessions?.[token]) {
    req.userId = db.sessions[token];
  } else {
    req.userId = 1;
  }
  next();
}

module.exports = { authMiddleware };
