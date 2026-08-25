<template>
  <view class="calendar">
    <view class="header">
      <view class="arrow" @click="prevMonth">
        <u-icon name="arrow-left" size="18" color="#1F2937" />
      </view>
      <text class="title">{{ year }}年{{ month }}月</text>
      <view class="arrow" @click="nextMonth">
        <u-icon name="arrow-right" size="18" color="#1F2937" />
      </view>
    </view>
    <view class="weekdays">
      <text v-for="w in weekdays" :key="w" class="weekday">{{ w }}</text>
    </view>
    <view class="days">
      <view
        v-for="(day, idx) in calendarDays"
        :key="idx"
        class="day-cell"
        :class="{
          empty: !day.date,
          disabled: day.disabled,
          selected: day.date === modelValue,
          today: day.isToday,
          hasDot: day.hasSchedule,
        }"
        @click="selectDay(day)"
      >
        <text v-if="day.date" class="day-num">{{ day.day }}</text>
        <view v-if="day.hasSchedule && day.date" class="dot" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  scheduleDates: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue', 'change']);

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const year = computed(() => currentYear.value);
const month = computed(() => currentMonth.value + 1);

const calendarDays = computed(() => {
  const y = currentYear.value;
  const m = currentMonth.value;
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const todayStr = today.toISOString().split('T')[0];
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push({ date: null });

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(dateStr);
    cells.push({
      day: d,
      date: dateStr,
      disabled: dateObj < new Date(todayStr),
      isToday: dateStr === todayStr,
      hasSchedule: props.scheduleDates.includes(dateStr),
    });
  }
  return cells;
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function selectDay(day) {
  if (!day.date || day.disabled) return;
  emit('update:modelValue', day.date);
  emit('change', day.date);
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const d = new Date(val);
      currentYear.value = d.getFullYear();
      currentMonth.value = d.getMonth();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.calendar {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.title {
  font-size: 32rpx;
  font-weight: 600;
}
.arrow {
  padding: 12rpx 24rpx;
}
.weekdays {
  display: flex;
  margin-bottom: 16rpx;
}
.weekday {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: #8a94a6;
}
.days {
  display: flex;
  flex-wrap: wrap;
}
.day-cell {
  width: calc(100% / 7);
  height: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.day-num {
  font-size: 28rpx;
  width: 64rpx;
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  border-radius: 50%;
}
.selected .day-num {
  background: #2878ff;
  color: #fff;
}
.disabled .day-num {
  color: #ccc;
}
.today:not(.selected) .day-num {
  color: #2878ff;
  font-weight: 600;
}
.dot {
  width: 8rpx;
  height: 8rpx;
  background: #2878ff;
  border-radius: 50%;
  position: absolute;
  bottom: 4rpx;
}
.selected .dot {
  background: #fff;
}
</style>
