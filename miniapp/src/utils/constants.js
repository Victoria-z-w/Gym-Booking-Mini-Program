export const CITIES = ['上海市', '北京市', '济南市', '青岛市', '潍坊市'];

export const COURSE_CATEGORIES = ['全部', 'HIIT', '瑜伽', '力量训练', '动感单车', '普拉提', '有氧', '拉伸', '搏击'];

export const DIFFICULTIES = ['全部', '初级', '中级', '高级'];

export const TIME_FILTERS = ['今天', '明天', '本周', '周末'];

export const SORT_OPTIONS = ['综合排序', '人气最高', '价格最低', '价格最高', '最新课程'];

export const BOOKING_STATUS = {
  BOOKED: { label: '待上课', color: '#2878FF', bg: '#E8F1FF' },
  COMPLETED: { label: '已完成', color: '#22C55E', bg: '#E8F9EF' },
  CANCELLED: { label: '已取消', color: '#8A94A6', bg: '#F0F2F5' },
};

export function getSlotStatus(remaining, capacity) {
  const ratio = remaining / capacity;
  if (remaining <= 0) return { label: '已满', type: 'info', color: '#8A94A6' };
  if (ratio <= 0.1) return { label: '紧张', type: 'error', color: '#FF4D4F' };
  if (ratio <= 0.4) return { label: '较少', type: 'warning', color: '#FF7A45' };
  return { label: '充足', type: 'success', color: '#22C55E' };
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dateOnly = dateStr.split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  if (dateOnly === todayStr) return '今天';
  if (dateOnly === tomorrowStr) return '明天';
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatTimeRange(start, end) {
  return `${start} - ${end}`;
}
