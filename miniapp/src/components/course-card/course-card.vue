<template>
  <view class="course-card" @click="handleClick">
    <image class="cover" :src="course.cover" mode="aspectFill" />
    <view class="info">
      <view class="top-row">
        <text class="name">{{ course.name }}</text>
        <u-tag :text="course.category" size="mini" type="primary" plain />
      </view>
      <view class="meta">
        <text class="coach">{{ course.coachName }}</text>
        <text class="dot">·</text>
        <text class="time" v-if="course.nextSchedule">
          {{ formatDate(course.nextSchedule.date) }} {{ course.nextSchedule.startTime }}
        </text>
      </view>
      <view class="bottom-row">
        <view class="tags">
          <text class="calories">{{ course.calories }} kcal</text>
          <text class="difficulty">{{ course.difficulty }}</text>
        </view>
        <view class="price-wrap">
          <text class="price">¥{{ course.price }}</text>
          <text class="remaining" v-if="course.remaining !== undefined">
            余{{ course.remaining }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { formatDate } from '../../utils/constants';

const props = defineProps({
  course: { type: Object, required: true },
});

const emit = defineEmits(['click']);

function handleClick() {
  emit('click', props.course);
  uni.navigateTo({ url: `/pages/course/detail?id=${props.course.id}` });
}
</script>

<style lang="scss" scoped>
.course-card {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.cover {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}
.info {
  flex: 1;
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  margin-right: 12rpx;
}
.meta {
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 8rpx;
}
.dot {
  margin: 0 8rpx;
}
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 12rpx;
}
.tags {
  display: flex;
  gap: 16rpx;
  font-size: 22rpx;
  color: #8a94a6;
}
.price {
  font-size: 32rpx;
  font-weight: 700;
  color: #2878ff;
}
.remaining {
  font-size: 22rpx;
  color: #22c55e;
  margin-left: 8rpx;
}
</style>
