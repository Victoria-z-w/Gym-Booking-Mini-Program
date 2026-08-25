const express = require('express');
const router = express.Router();
const { getDb, save } = require('../data/store');

const USER_ID = (req) => req.userId;

router.get('/info', (req, res) => {
  const db = getDb();
  const user = db.users.find((u) => u.id === USER_ID(req));
  const favoriteCount = db.favorites.filter((f) => f.userId === USER_ID(req)).length;
  const bookedCount = db.bookings.filter(
    (b) => b.userId === USER_ID(req) && b.status === 'BOOKED'
  ).length;
  res.json({
    code: 0,
    data: { ...user, favoriteCount, bookedCount },
  });
});

router.put('/city', (req, res) => {
  const db = getDb();
  const user = db.users.find((u) => u.id === USER_ID(req));
  if (user) {
    user.city = req.body.city;
    save();
  }
  res.json({ code: 0, data: user });
});

router.get('/favorites', (req, res) => {
  const db = getDb();
  const favs = db.favorites.filter((f) => f.userId === USER_ID(req));
  const courses = favs
    .map((f) => {
      const course = db.courses.find((c) => c.id === f.courseId);
      if (!course) return null;
      const coach = db.coaches.find((c) => c.id === course.coachId);
      return { ...course, coachName: coach?.name, favoriteId: f.id };
    })
    .filter(Boolean);
  res.json({ code: 0, data: courses });
});

router.post('/favorites/toggle', (req, res) => {
  const db = getDb();
  const courseId = Number(req.body.courseId);
  const idx = db.favorites.findIndex(
    (f) => f.userId === USER_ID(req) && f.courseId === courseId
  );
  let isFavorite;
  if (idx >= 0) {
    db.favorites.splice(idx, 1);
    isFavorite = false;
  } else {
    db.favorites.push({ id: Date.now(), userId: USER_ID(req), courseId });
    isFavorite = true;
  }
  save();
  res.json({ code: 0, data: { isFavorite } });
});

router.get('/coupons', (req, res) => {
  const db = getDb();
  const { status } = req.query;
  let list = db.coupons.filter((c) => c.userId === USER_ID(req));
  if (status) list = list.filter((c) => c.status === status);
  res.json({ code: 0, data: list });
});

router.get('/points', (req, res) => {
  const db = getDb();
  const user = db.users.find((u) => u.id === USER_ID(req));
  const records = db.pointsRecords.filter((r) => r.userId === USER_ID(req));
  res.json({ code: 0, data: { points: user.points, records } });
});

router.get('/search/history', (req, res) => {
  const db = getDb();
  res.json({ code: 0, data: db.searchHistory });
});

router.post('/search/history', (req, res) => {
  const db = getDb();
  const { keyword } = req.body;
  if (!keyword) return res.json({ code: 0, data: db.searchHistory });
  db.searchHistory = db.searchHistory.filter((k) => k !== keyword);
  db.searchHistory.unshift(keyword);
  db.searchHistory = db.searchHistory.slice(0, 10);
  save();
  res.json({ code: 0, data: db.searchHistory });
});

router.delete('/search/history', (req, res) => {
  const db = getDb();
  db.searchHistory = [];
  save();
  res.json({ code: 0, data: [] });
});

router.get('/search', (req, res) => {
  const db = getDb();
  const { keyword } = req.query;
  if (!keyword) {
    return res.json({ code: 0, data: { courses: [], coaches: [], gyms: [] } });
  }
  const kw = keyword.toLowerCase();
  const courses = db.courses
    .filter((c) => c.name.toLowerCase().includes(kw))
    .map((c) => {
      const coach = db.coaches.find((co) => co.id === c.coachId);
      const gym = db.gyms.find((g) => g.id === c.gymId);
      return { ...c, coachName: coach?.name || '', gymName: gym?.name || '' };
    });
  const coaches = db.coaches.filter((c) => c.name.toLowerCase().includes(kw));
  const gyms = db.gyms.filter(
    (g) => g.name.toLowerCase().includes(kw) || g.address.toLowerCase().includes(kw)
  );
  res.json({ code: 0, data: { courses, coaches, gyms } });
});

module.exports = router;
