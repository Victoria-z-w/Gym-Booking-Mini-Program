const express = require('express');
const router = express.Router();
const { getDb } = require('../data/store');

router.get('/list', (req, res) => {
  const db = getDb();
  const userId = req.userId;
  let list = (db.orders || []).filter((o) => o.userId === userId);
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ code: 0, data: list });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const order = (db.orders || []).find(
    (o) => o.id === Number(req.params.id) && o.userId === req.userId
  );
  if (!order) return res.status(404).json({ code: 404, message: '订单不存在' });
  const booking = db.bookings.find((b) => b.id === order.bookingId);
  res.json({ code: 0, data: { ...order, bookingStatus: booking?.status } });
});

module.exports = router;
