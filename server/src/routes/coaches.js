const express = require('express');
const router = express.Router();
const { getDb } = require('../data/store');

router.get('/list', (req, res) => {
  const db = getDb();
  const { keyword } = req.query;
  let list = [...db.coaches];
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(kw) ||
        c.tags.some((t) => t.toLowerCase().includes(kw))
    );
  }
  res.json({ code: 0, data: list });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const coach = db.coaches.find((c) => c.id === Number(req.params.id));
  if (!coach) return res.status(404).json({ code: 404, message: '教练不存在' });
  const courses = db.courses.filter((c) => c.coachId === coach.id).map((c) => {
    const gym = db.gyms.find((g) => g.id === c.gymId);
    return { ...c, coachName: coach.name, gymName: gym?.name || '' };
  });
  const schedules = db.schedules
    .filter((s) => s.coachId === coach.id)
    .slice(0, 10);
  res.json({ code: 0, data: { ...coach, courses, schedules } });
});

module.exports = router;
