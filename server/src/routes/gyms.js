const express = require('express');
const router = express.Router();
const { getDb } = require('../data/store');

router.get('/list', (req, res) => {
  const db = getDb();
  const { keyword } = req.query;
  let list = [...db.gyms];
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter(
      (g) => g.name.toLowerCase().includes(kw) || g.address.toLowerCase().includes(kw)
    );
  }
  res.json({ code: 0, data: list });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const gym = db.gyms.find((g) => g.id === Number(req.params.id));
  if (!gym) return res.status(404).json({ code: 404, message: '场馆不存在' });
  const courses = db.courses.filter((c) => c.gymId === gym.id).map((c) => {
    const coach = db.coaches.find((co) => co.id === c.coachId);
    return { ...c, coachName: coach?.name || '', gymName: gym.name };
  });
  const coaches = db.coaches.filter((c) =>
    courses.some((co) => co.coachId === c.id)
  );
  res.json({ code: 0, data: { ...gym, courses, coaches } });
});

module.exports = router;
