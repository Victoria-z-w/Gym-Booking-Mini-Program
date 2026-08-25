const IMG = {
  banner1: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  banner2: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80',
  banner3: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  hiit: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  spin: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
  strength: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
  pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  boxing: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80',
  coach1: 'https://images.unsplash.com/photo-1567013120252-40c8c4b6b8b8?w=200&q=80',
  coach2: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80',
  coach3: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&q=80',
  gym1: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  gym2: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
};

function generateSchedules(courseId, coachId, gymId, dates) {
  const slots = [
    { start: '17:30', end: '18:15', booked: 4 },
    { start: '18:30', end: '19:15', booked: 12 },
    { start: '19:30', end: '20:15', booked: 18 },
    { start: '20:30', end: '21:15', booked: 20 },
  ];
  const schedules = [];
  let id = courseId * 100;
  dates.forEach((date) => {
    slots.forEach((slot) => {
      id++;
      const capacity = 20;
      const bookedCount = slot.booked;
      schedules.push({
        id,
        courseId,
        coachId,
        gymId,
        date,
        startTime: slot.start,
        endTime: slot.end,
        capacity,
        bookedCount,
        status: bookedCount >= capacity ? 'FULL' : 'AVAILABLE',
      });
    });
  });
  return schedules;
}

function getDates(days = 14) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const dates = getDates(14);

const users = [
  {
    id: 1,
    nickname: '爱健身的 Lily',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    memberId: '12345678',
    memberLevel: '黄金会员',
    memberExpire: '2027-06-30',
    points: 12880,
    remainingCourses: 12,
    couponCount: 3,
    city: '上海市',
  },
];

const coaches = [
  {
    id: 101,
    name: 'Leo 教练',
    avatar: IMG.coach1,
    rating: 4.9,
    experience: 6,
    courseCount: 128,
    tags: ['HIIT', '减脂', '体能训练'],
    specialty: 'HIIT / 功能训练 / 减脂塑形',
    bio: '6年专业健身教学经验，擅长高强度间歇训练与功能性训练，帮助学员科学减脂塑形。',
    certificates: ['ACE认证', 'NSCA-CPT', 'CrossFit L1'],
  },
  {
    id: 102,
    name: 'Anna 教练',
    avatar: IMG.coach2,
    rating: 4.8,
    experience: 5,
    courseCount: 96,
    tags: ['瑜伽', '普拉提', '拉伸'],
    specialty: '瑜伽 / 普拉提 / 体态矫正',
    bio: '国际瑜伽联盟认证教练，专注身心平衡与体态改善。',
    certificates: ['RYT-500', '普拉提认证'],
  },
  {
    id: 103,
    name: 'Mike 教练',
    avatar: IMG.coach3,
    rating: 4.7,
    experience: 8,
    courseCount: 156,
    tags: ['力量训练', '搏击', '增肌'],
    specialty: '力量训练 / 搏击 / 增肌',
    bio: '前职业搏击运动员，8年私教经验，擅长力量与格斗训练。',
    certificates: ['NSCA-CSCS', '搏击教练证'],
  },
];

const gyms = [
  {
    id: 201,
    name: '动感健身 · 中心店',
    cover: IMG.gym1,
    images: [IMG.gym1, IMG.gym2, IMG.banner1],
    distance: '1.2km',
    address: '上海市浦东新区世纪大道1000号',
    phone: '021-88886666',
    openTime: '06:00',
    closeTime: '23:00',
    rating: 4.8,
    facilities: ['淋浴', '储物柜', '停车', 'WiFi', '饮水'],
    latitude: 31.2304,
    longitude: 121.4737,
  },
  {
    id: 202,
    name: '动感健身 · 滨江店',
    cover: IMG.gym2,
    images: [IMG.gym2, IMG.gym1],
    distance: '2.5km',
    address: '上海市徐汇区龙腾大道2555号',
    phone: '021-88887777',
    openTime: '07:00',
    closeTime: '22:00',
    rating: 4.6,
    facilities: ['淋浴', '储物柜', 'WiFi', '饮水', '桑拿'],
    latitude: 31.1792,
    longitude: 121.4648,
  },
];

const courses = [
  {
    id: 1001,
    name: 'HIIT 燃脂训练',
    cover: IMG.hiit,
    coachId: 101,
    gymId: 201,
    category: 'HIIT',
    duration: 45,
    calories: 450,
    difficulty: '高强度',
    price: 128,
    rating: 4.9,
    reviewCount: 1288,
    tags: ['减脂', 'HIIT', '体能提升', '高强度'],
    description: '高强度间歇训练，通过短时间高强度运动与休息交替进行，全面提升心肺能力，加速脂肪燃烧，提高运动表现。',
    popularity: 98,
  },
  {
    id: 1002,
    name: '晨间瑜伽',
    cover: IMG.yoga,
    coachId: 102,
    gymId: 201,
    category: '瑜伽',
    duration: 60,
    calories: 200,
    difficulty: '初级',
    price: 88,
    rating: 4.8,
    reviewCount: 856,
    tags: ['瑜伽', '放松', '柔韧'],
    description: '温和的晨间瑜伽课程，唤醒身体活力，改善柔韧性与身心平衡。',
    popularity: 85,
  },
  {
    id: 1003,
    name: '动感单车',
    cover: IMG.spin,
    coachId: 101,
    gymId: 202,
    category: '动感单车',
    duration: 45,
    calories: 500,
    difficulty: '中级',
    price: 98,
    rating: 4.7,
    reviewCount: 642,
    tags: ['有氧', '燃脂', '骑行'],
    description: '跟随音乐节奏骑行，高效燃脂，增强心肺功能。',
    popularity: 90,
  },
  {
    id: 1004,
    name: '力量塑形',
    cover: IMG.strength,
    coachId: 103,
    gymId: 201,
    category: '力量训练',
    duration: 50,
    calories: 380,
    difficulty: '中级',
    price: 138,
    rating: 4.8,
    reviewCount: 523,
    tags: ['力量', '增肌', '塑形'],
    description: '系统力量训练，针对主要肌群进行塑形与力量提升。',
    popularity: 78,
  },
  {
    id: 1005,
    name: '普拉提核心',
    cover: IMG.pilates,
    coachId: 102,
    gymId: 202,
    category: '普拉提',
    duration: 55,
    calories: 250,
    difficulty: '初级',
    price: 108,
    rating: 4.9,
    reviewCount: 412,
    tags: ['普拉提', '核心', '体态'],
    description: '专注核心肌群训练，改善体态，增强身体稳定性。',
    popularity: 72,
  },
  {
    id: 1006,
    name: '搏击燃脂',
    cover: IMG.boxing,
    coachId: 103,
    gymId: 201,
    category: '搏击',
    duration: 45,
    calories: 520,
    difficulty: '高级',
    price: 148,
    rating: 4.7,
    reviewCount: 389,
    tags: ['搏击', '燃脂', '高强度'],
    description: '结合拳击与踢腿动作，高强度全身燃脂训练。',
    popularity: 88,
  },
];

const schedules = [
  ...generateSchedules(1001, 101, 201, dates),
  ...generateSchedules(1002, 102, 201, dates),
  ...generateSchedules(1003, 101, 202, dates),
  ...generateSchedules(1004, 103, 201, dates),
  ...generateSchedules(1005, 102, 202, dates),
  ...generateSchedules(1006, 103, 201, dates),
];

const banners = [
  { id: 1, image: IMG.banner1, title: '开启蜕变之旅', subtitle: '遇见更好的自己', link: '/pages/course/index' },
  { id: 2, image: IMG.banner2, title: '新会员专享', subtitle: '首月8折优惠', link: '/pages/member/index' },
  { id: 3, image: IMG.banner3, title: '私教一对一', subtitle: '定制专属训练计划', link: '/pages/coach/index' },
];

const coupons = [
  { id: 1, userId: 1, name: '满100减20', type: 'discount', value: 20, minAmount: 100, startDate: '2026-08-01', endDate: '2026-09-01', status: 'available' },
  { id: 2, userId: 1, name: '满200减50', type: 'discount', value: 50, minAmount: 200, startDate: '2026-08-01', endDate: '2026-09-30', status: 'available' },
  { id: 3, userId: 1, name: '体验课8折', type: 'percent', value: 0.8, minAmount: 0, startDate: '2026-07-01', endDate: '2026-08-31', status: 'available' },
  { id: 4, userId: 1, name: '满50减10', type: 'discount', value: 10, minAmount: 50, startDate: '2026-06-01', endDate: '2026-07-31', status: 'expired' },
  { id: 5, userId: 1, name: '新人礼券', type: 'discount', value: 30, minAmount: 100, startDate: '2026-05-01', endDate: '2026-06-30', status: 'used' },
];

const pointsRecords = [
  { id: 1, userId: 1, type: 'sign', title: '每日签到', points: 10, time: '2026-08-25 08:00:00' },
  { id: 2, userId: 1, type: 'course', title: '完成课程', points: 50, time: '2026-08-24 19:30:00' },
  { id: 3, userId: 1, type: 'invite', title: '邀请好友', points: 100, time: '2026-08-20 14:00:00' },
  { id: 4, userId: 1, type: 'exchange', title: '兑换优惠券', points: -500, time: '2026-08-15 10:00:00' },
  { id: 5, userId: 1, type: 'course', title: '完成课程', points: 50, time: '2026-08-10 18:00:00' },
];

const bookings = [];
const favorites = [];
const searchHistory = ['HIIT', '瑜伽', 'Leo', '中心店'];

module.exports = {
  users,
  coaches,
  gyms,
  courses,
  schedules,
  banners,
  coupons,
  pointsRecords,
  bookings,
  favorites,
  searchHistory,
};
