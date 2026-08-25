<template>
  <view class="page" v-if="booking">
    <image class="cover" :src="booking.courseCover" mode="aspectFill" />
    <view class="card">
      <view class="status-bar" :style="{ background: statusInfo.bg, color: statusInfo.color }">
        {{ statusInfo.label }}
      </view>
      <view class="row"><text class="label">预约编号</text><text>{{ booking.bookingNo }}</text></view>
      <view class="row"><text class="label">课程名称</text><text>{{ booking.courseName }}</text></view>
      <view class="row"><text class="label">授课教练</text><text>{{ booking.coachName }}</text></view>
      <view class="row"><text class="label">上课时间</text><text>{{ booking.scheduleDate }} {{ booking.startTime }}-{{ booking.endTime }}</text></view>
      <view class="row"><text class="label">课程时长</text><text>{{ booking.courseDuration }} 分钟</text></view>
      <view class="row"><text class="label">上课地点</text><text>{{ booking.gymName }}</text></view>
      <view class="row"><text class="label">详细地址</text><text>{{ booking.gymAddress }}</text></view>
      <view class="row"><text class="label">预约时间</text><text>{{ booking.bookingTime }}</text></view>
      <view class="row"><text class="label">支付金额</text><text class="price">¥{{ booking.price }}</text></view>
    </view>

    <view class="footer safe-bottom" v-if="booking.status === 'BOOKED'">
      <u-button text="取消预约" type="error" plain :custom-style="btnStyle" @click="showCancel = true" />
    </view>

    <u-modal
      :show="showCancel"
      title="取消预约"
      content="确定取消该课程预约吗？"
      :show-cancel-button="true"
      confirm-text="确定取消"
      @confirm="confirmCancel"
      @cancel="showCancel = false"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getBookingDetail, cancelBooking } from '../../services/booking';
import { BOOKING_STATUS } from '../../utils/constants';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const booking = ref(null);
const showCancel = ref(false);
const btnStyle = { borderRadius: '44rpx', height: '88rpx' };

const statusInfo = computed(() =>
  booking.value ? BOOKING_STATUS[booking.value.status] : BOOKING_STATUS.BOOKED
);

onMounted(async () => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  const id = Number(page.options?.id);
  booking.value = await getBookingDetail(id);
});

async function confirmCancel() {
  showCancel.value = false;
  try {
    await cancelBooking(booking.value.id);
    uni.showToast({ title: '预约已取消', icon: 'success' });
    booking.value = await getBookingDetail(booking.value.id);
    userStore.refreshBookingCount();
  } catch (e) {
    console.error(e);
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding-bottom: 140rpx;
}
.cover {
  width: 100%;
  height: 360rpx;
}
.card {
  margin: -40rpx 24rpx 0;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  position: relative;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}
.status-bar {
  text-align: center;
  padding: 16rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
  font-size: 28rpx;
}
.label {
  color: #8a94a6;
  flex-shrink: 0;
  margin-right: 24rpx;
}
.price {
  color: #2878ff;
  font-weight: 600;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  background: #fff;
}
</style>
