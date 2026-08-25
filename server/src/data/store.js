const fs = require('fs');
const path = require('path');
const mockData = require('./mockData');

const DATA_FILE = path.join(__dirname, 'db.json');

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Load db failed, using mock data:', e.message);
  }
  return {
    users: [...mockData.users],
    coaches: [...mockData.coaches],
    gyms: [...mockData.gyms],
    courses: [...mockData.courses],
    schedules: [...mockData.schedules],
    banners: [...mockData.banners],
    coupons: [...mockData.coupons],
    pointsRecords: [...mockData.pointsRecords],
    bookings: [...mockData.bookings],
    favorites: [...mockData.favorites],
    searchHistory: [...mockData.searchHistory],
    orders: [],
    sessions: {},
    bookingSeq: 0,
    orderSeq: 0,
  };
}

let db = load();

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

function getDb() {
  return db;
}

function resetDb() {
  db = load();
  if (!fs.existsSync(DATA_FILE)) {
    save();
  }
}

function generateBookingNo(date) {
  db.bookingSeq = (db.bookingSeq || 0) + 1;
  const d = date.replace(/-/g, '');
  return `GYM${d}${String(db.bookingSeq).padStart(4, '0')}`;
}

function generateOrderNo() {
  db.orderSeq = (db.orderSeq || 0) + 1;
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `ORD${d}${String(db.orderSeq).padStart(4, '0')}`;
}

function createOrderForBooking(booking, course, db) {
  if (!db.orders) db.orders = [];
  const order = {
    id: Date.now(),
    orderNo: generateOrderNo(),
    userId: booking.userId,
    bookingId: booking.id,
    bookingNo: booking.bookingNo,
    courseId: course.id,
    courseName: course.name,
    courseCover: course.cover,
    price: booking.price,
    status: 'PAID',
    payMethod: '到店核销',
    createdAt: booking.bookingTime,
  };
  db.orders.push(order);
  return order;
}

function updateScheduleStatus(schedule) {
  if (schedule.bookedCount >= schedule.capacity) {
    schedule.status = 'FULL';
  } else {
    schedule.status = 'AVAILABLE';
  }
}

function autoCompleteBookings() {
  const now = new Date();
  db.bookings.forEach((b) => {
    if (b.status !== 'BOOKED') return;
    const schedule = db.schedules.find((s) => s.id === b.scheduleId);
    if (!schedule) return;
    const end = new Date(`${schedule.date}T${schedule.endTime}:00`);
    if (end < now) {
      b.status = 'COMPLETED';
    }
  });
}

module.exports = {
  getDb,
  save,
  resetDb,
  generateBookingNo,
  generateOrderNo,
  createOrderForBooking,
  updateScheduleStatus,
  autoCompleteBookings,
};
