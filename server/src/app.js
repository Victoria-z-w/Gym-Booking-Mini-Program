const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { resetDb } = require('./data/store');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

resetDb();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin.split(',').map((s) => s.trim()) }
      : { origin: true }
  )
);
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ code: 0, message: 'ok', env: isProd ? 'production' : 'development' });
});

app.use('/api/auth', require('./routes/auth'));

app.use(authMiddleware);
app.use('/api/courses', require('./routes/courses'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/gyms', require('./routes/gyms'));
app.use('/api/user', require('./routes/user'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 500, message: '服务器错误' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gym Booking API running on port ${PORT} (${isProd ? 'production' : 'dev'})`);
});
