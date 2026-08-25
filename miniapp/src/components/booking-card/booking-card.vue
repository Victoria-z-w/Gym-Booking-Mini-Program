<template>
  <view class="booking-card">
    <view class="card-body" @click="goDetail">
      <image class="cover" :src="booking.courseCover" mode="aspectFill" />
      <view class="info">
        <view class="top">
          <text class="name">{{ booking.courseName }}</text>
          <view class="status" :style="{ color: statusInfo.color, background: statusInfo.bg }">
            {{ statusInfo.label }}
          </view>
        </view>
        <text class="coach">{{ booking.coachName }}</text>
        <text class="time">
          {{ booking.scheduleDate }} {{ booking.startTime }}-{{ booking.endTime }}
        </text>
        <text class="gym">{{ booking.gymName }}</text>
        <text class="no">预约编号：{{ booking.bookingNo }}</text>
      </view>
    </view>
    <view class="actions">
      <u-button
        text="查看详情"
        size="small"
        :custom-style="btnStyle"
        @click="goDetail"
      />
      <u-button
        v-if="booking.status === 'BOOKED'"
        text="取消预约"
        size="small"
        type="error"
        plain
        :custom-style="btnStyle"
        @click="$emit('cancel', booking)"
      />
      <u-button
        v-if="booking.status === 'COMPLETED'"
        text="评价课程"
        size="small"
        type="primary"
        plain
        :custom-style="btnStyle"
        @click="$emit('review', booking)"
      />
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { BOOKING_STATUS } from '../../utils/constants';

const props = defineProps({
  booking: { type: Object, required: true },
});

defineEmits(['cancel', 'review']);

const statusInfo = computed(() => BOOKING_STATUS[props.booking.status] || BOOKING_STATUS.BOOKED);
const btnStyle = { borderRadius: '32rpx', height: '60rpx', minWidth: '160rpx' };

function goDetail() {
  uni.navigateTo({ url: `/pages/booking/detail?id=${props.booking.id}` });
}
</script>

<style lang="scss" scoped>
.booking-card {
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.card-body {
  display: flex;
  padding: 24rpx;
}
.cover {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}
.info {
  flex: 1;
  margin-left: 20rpx;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.name {
  font-size: 30rpx;
  font-weight: 600;
  flex: 1;
}
.status {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  flex-shrink: 0;
}
.coach, .time, .gym, .no {
  display: block;
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 8rpx;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  padding: 0 24rpx 24rpx;
}
</style>
