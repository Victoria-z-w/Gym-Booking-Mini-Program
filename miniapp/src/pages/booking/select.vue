<template>
  <view class="page">
    <calendar
      v-model="selectedDate"
      :schedule-dates="scheduleDates"
      @change="onDateChange"
    />

    <view class="slots-section">
      <text class="section-title">选择时间段</text>
      <view v-if="loadingSlots" class="loading">
        <u-loading-icon />
      </view>
      <time-slot
        v-for="slot in schedules"
        :key="slot.id"
        :slot="slot"
        :selected="selectedSlot?.id === slot.id"
        @select="onSlotSelect"
      />
      <empty-state v-if="!loadingSlots && schedules.length === 0" text="该日期暂无排课" />
    </view>

    <view class="footer safe-bottom">
      <u-button
        type="primary"
        text="确认预约"
        :disabled="!selectedSlot"
        :loading="submitting"
        :custom-style="{ borderRadius: '44rpx', height: '88rpx' }"
        @click="showConfirm = true"
      />
    </view>

    <u-modal
      :show="showConfirm"
      title="确认预约"
      :show-cancel-button="true"
      confirm-text="确认预约"
      cancel-text="取消"
      @confirm="submitBooking"
      @cancel="showConfirm = false"
    >
      <view class="confirm-content" v-if="course && selectedSlot">
        <view class="confirm-row"><text class="label">课程</text><text>{{ course.name }}</text></view>
        <view class="confirm-row"><text class="label">教练</text><text>{{ course.coach?.name }}</text></view>
        <view class="confirm-row"><text class="label">日期</text><text>{{ selectedDate }}</text></view>
        <view class="confirm-row"><text class="label">时间</text><text>{{ selectedSlot.startTime }} - {{ selectedSlot.endTime }}</text></view>
        <view class="confirm-row"><text class="label">场馆</text><text>{{ course.gym?.name }}</text></view>
        <view class="confirm-row"><text class="label">价格</text><text class="price">¥{{ course.price }}</text></view>
      </view>
    </u-modal>

    <u-modal
      :show="showSuccess"
      title="预约成功"
      :show-cancel-button="true"
      confirm-text="查看我的预约"
      cancel-text="返回首页"
      @confirm="goBookings"
      @cancel="goHome"
    >
      <view class="success-content">
        <u-icon name="checkmark-circle-fill" color="#22C55E" size="60" />
        <text class="success-course">{{ course?.name }}</text>
        <text class="success-time">{{ selectedDate }} {{ selectedSlot?.startTime }}</text>
        <text class="success-gym">{{ course?.gym?.name }}</text>
      </view>
    </u-modal>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCourseDetail, getCourseSchedules } from '../../services/course';
import { createBooking } from '../../services/booking';
import { useUserStore } from '../../store/user';
import Calendar from '../../components/calendar/calendar.vue';
import TimeSlot from '../../components/time-slot/time-slot.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const userStore = useUserStore();
const courseId = ref(0);
const course = ref(null);
const selectedDate = ref('');
const selectedSlot = ref(null);
const schedules = ref([]);
const scheduleDates = ref([]);
const loadingSlots = ref(false);
const submitting = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);

onMounted(async () => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  courseId.value = Number(page.options?.courseId);
  selectedDate.value = new Date().toISOString().split('T')[0];
  course.value = await getCourseDetail(courseId.value);
  await loadAllScheduleDates();
  await loadSchedules();
});

async function loadAllScheduleDates() {
  const all = await getCourseSchedules(courseId.value);
  scheduleDates.value = [...new Set(all.map((s) => s.date))];
}

async function loadSchedules() {
  loadingSlots.value = true;
  selectedSlot.value = null;
  try {
    schedules.value = await getCourseSchedules(courseId.value, selectedDate.value);
  } finally {
    loadingSlots.value = false;
  }
}

function onDateChange() {
  loadSchedules();
}

function onSlotSelect(slot) {
  selectedSlot.value = slot;
}

async function submitBooking() {
  if (submitting.value || !selectedSlot.value) return;
  submitting.value = true;
  showConfirm.value = false;
  try {
    await createBooking({
      courseId: courseId.value,
      scheduleId: selectedSlot.value.id,
    });
    showSuccess.value = true;
    userStore.refreshBookingCount();
  } catch (e) {
    console.error(e);
  } finally {
    submitting.value = false;
  }
}

function goBookings() {
  showSuccess.value = false;
  uni.switchTab({ url: '/pages/booking/index' });
}

function goHome() {
  showSuccess.value = false;
  uni.switchTab({ url: '/pages/home/index' });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding: 24rpx;
  padding-bottom: 160rpx;
}
.slots-section {
  margin-top: 24rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 20rpx;
}
.loading {
  display: flex;
  justify-content: center;
  padding: 40rpx;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}
.confirm-content {
  padding: 20rpx 0;
}
.confirm-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
  font-size: 28rpx;
}
.label {
  color: #8a94a6;
}
.price {
  color: #2878ff;
  font-weight: 600;
}
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  gap: 12rpx;
}
.success-course {
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 16rpx;
}
.success-time, .success-gym {
  font-size: 26rpx;
  color: #8a94a6;
}
</style>
