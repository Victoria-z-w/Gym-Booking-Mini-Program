const express = require('express');
const router = express.Router();
const { getDb, save, autoCompleteBookings } = require('../data/store');

function enrichCourse(course, db) {
  const coach = db.coaches.find((c) => c.id === course.coachId);
  const gym = db.gyms.find((g) => g.id === course.gymId);
  const todaySchedules = db.schedules.filter(
    (s) => s.courseId === course.id && s.date === new Date().toISOString().split('T')[0]
  );
  const nextSchedule = todaySchedules.find((s) => s.status === 'AVAILABLE') || todaySchedules[0];
  return {
    ...course,
    coachName: coach?.name || '',
    coachAvatar: coach?.avatar || '',
    gymName: gym?.name || '',
    nextSchedule,
    remaining: nextSchedule ? nextSchedule.capacity - nextSchedule.bookedCount : 0,
  };
}

router.get('/banners', (req, res) => {
  const db = getDb();
  res.json({ code: 0, data: db.banners });
});

router.get('/list', (req, res) => {
  const db = getDb();
  autoCompleteBookings();
  let list = [...db.courses];
  const { category, difficulty, timeFilter, sort, keyword } = req.query;

  if (category && category !== '全部') {
    list = list.filter((c) => c.category === category);
  }
  if (difficulty && difficulty !== '全部') {
    const map = { 初级: '初级', 中级: '中级', 高级: '高级', 高强度: '高级' };
    list = list.filter((c) => c.difficulty === (map[difficulty] || difficulty));
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter((c) => {
      const coach = db.coaches.find((co) => co.id === c.coachId);
      const gym = db.gyms.find((g) => g.id === c.gymId);
      return (
        c.name.toLowerCase().includes(kw) ||
        (coach && coach.name.toLowerCase().includes(kw)) ||
        (gym && gym.name.toLowerCase().includes(kw))
      );
    });
  }
  if (timeFilter) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    list = list.filter((c) => {
      const schedules = db.schedules.filter((s) => s.courseId === c.id);
      if (timeFilter === '今天') return schedules.some((s) => s.date === todayStr);
      if (timeFilter === '明天') return schedules.some((s) => s.date === tomorrowStr);
      if (timeFilter === '本周' || timeFilter === '周末') return schedules.length > 0;
      return true;
    });
  }
  if (sort === '人气最高') list.sort((a, b) => b.popularity - a.popularity);
  else if (sort === '价格最低') list.sort((a, b) => a.price - b.price);
  else if (sort === '价格最高') list.sort((a, b) => b.price - a.price);
  else if (sort === '最新课程') list.sort((a, b) => b.id - a.id);
  else list.sort((a, b) => b.popularity - a.popularity);

  res.json({ code: 0, data: list.map((c) => enrichCourse(c, db)) });
});

router.get('/hot', (req, res) => {
  const db = getDb();
  const list = [...db.courses].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  res.json({ code: 0, data: list.map((c) => enrichCourse(c, db)) });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const course = db.courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).json({ code: 404, message: '课程不存在' });
  const coach = db.coaches.find((c) => c.id === course.coachId);
  const gym = db.gyms.find((g) => g.id === course.gymId);
  const isFavorite = db.favorites.some(
    (f) => f.userId === 1 && f.courseId === course.id
  );
  res.json({
    code: 0,
    data: {
      ...course,
      coach,
      gym,
      isFavorite,
    },
  });
});

router.get('/:id/schedules', (req, res) => {
  const db = getDb();
  const courseId = Number(req.params.id);
  const { date } = req.query;
  let schedules = db.schedules.filter((s) => s.courseId === courseId);
  if (date) schedules = schedules.filter((s) => s.date === date);
  schedules = schedules.map((s) => ({
    ...s,
    remaining: s.capacity - s.bookedCount,
  }));
  res.json({ code: 0, data: schedules });
});

module.exports = router;
