const express = require('express');
const router = express.Router();
const {
  getDb,
  save,
  generateBookingNo,
  updateScheduleStatus,
  autoCompleteBookings,
  createOrderForBooking,
} = require('../data/store');

function enrichBooking(booking, db) {
  const course = db.courses.find((c) => c.id === booking.courseId);
  const coach = db.coaches.find((c) => c.id === booking.coachId);
  const gym = db.gyms.find((g) => g.id === booking.gymId);
  const schedule = db.schedules.find((s) => s.id === booking.scheduleId);
  return {
    ...booking,
    courseName: course?.name || '',
    courseCover: course?.cover || '',
    courseDuration: course?.duration || 0,
    coachName: coach?.name || '',
    gymName: gym?.name || '',
    gymAddress: gym?.address || '',
    scheduleDate: schedule?.date || '',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
  };
}

router.get('/list', (req, res) => {
  const db = getDb();
  autoCompleteBookings();
  save();
  const userId = req.userId;
  const { status } = req.query;
  let list = db.bookings.filter((b) => b.userId === userId);
  if (status) list = list.filter((b) => b.status === status);
  list.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
  res.json({ code: 0, data: list.map((b) => enrichBooking(b, db)) });
});

router.get('/counts', (req, res) => {
  const db = getDb();
  autoCompleteBookings();
  const userId = req.userId;
  const booked = db.bookings.filter((b) => b.userId === userId && b.status === 'BOOKED').length;
  res.json({ code: 0, data: { booked } });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const booking = db.bookings.find(
    (b) => b.id === Number(req.params.id) && b.userId === req.userId
  );
  if (!booking) return res.status(404).json({ code: 404, message: '预约不存在' });
  res.json({ code: 0, data: enrichBooking(booking, db) });
});

router.post('/create', (req, res) => {
  const db = getDb();
  const userId = req.userId;
  const { courseId, scheduleId } = req.body;
  const course = db.courses.find((c) => c.id === Number(courseId));
  const schedule = db.schedules.find((s) => s.id === Number(scheduleId));
  if (!course || !schedule) {
    return res.json({ code: 400, message: '课程或排课不存在' });
  }
  const now = new Date();
  const scheduleStart = new Date(`${schedule.date}T${schedule.startTime}:00`);
  if (scheduleStart < now) {
    return res.json({ code: 400, message: '该时间段已过期，无法预约' });
  }
  if (schedule.status === 'FULL' || schedule.bookedCount >= schedule.capacity) {
    return res.json({ code: 400, message: '该时间段已满' });
  }
  const duplicate = db.bookings.find(
    (b) =>
      b.userId === userId &&
      b.courseId === Number(courseId) &&
      b.scheduleId === Number(scheduleId) &&
      b.status === 'BOOKED'
  );
  if (duplicate) {
    return res.json({ code: 400, message: '您已经预约过该课程' });
  }
  schedule.bookedCount += 1;
  updateScheduleStatus(schedule);
  const booking = {
    id: Date.now(),
    bookingNo: generateBookingNo(schedule.date),
    userId,
    courseId: course.id,
    scheduleId: schedule.id,
    coachId: course.coachId,
    gymId: course.gymId,
    bookingTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    status: 'BOOKED',
    price: course.price,
  };
  db.bookings.push(booking);
  createOrderForBooking(booking, course, db);
  save();
  res.json({ code: 0, data: enrichBooking(booking, db), message: '预约成功' });
});

router.post('/:id/cancel', (req, res) => {
  const db = getDb();
  const booking = db.bookings.find(
    (b) => b.id === Number(req.params.id) && b.userId === req.userId
  );
  if (!booking) return res.json({ code: 404, message: '预约不存在' });
  if (booking.status !== 'BOOKED') {
    return res.json({ code: 400, message: '该预约无法取消' });
  }
  booking.status = 'CANCELLED';
  const schedule = db.schedules.find((s) => s.id === booking.scheduleId);
  if (schedule && schedule.bookedCount > 0) {
    schedule.bookedCount -= 1;
    updateScheduleStatus(schedule);
  }
  const order = (db.orders || []).find((o) => o.bookingId === booking.id);
  if (order) order.status = 'REFUNDED';
  save();
  res.json({ code: 0, data: enrichBooking(booking, db), message: '预约已取消' });
});

router.post('/:id/review', (req, res) => {
  const db = getDb();
  const booking = db.bookings.find(
    (b) => b.id === Number(req.params.id) && b.userId === req.userId
  );
  if (!booking) return res.json({ code: 404, message: '预约不存在' });
  const { rating, content } = req.body;
  booking.review = { rating, content, time: new Date().toISOString() };
  save();
  res.json({ code: 0, message: '评价成功' });
});

module.exports = router;
