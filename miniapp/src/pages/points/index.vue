<template>
  <view class="page">
    <view class="points-header">
      <text class="points-label">当前积分</text>
      <text class="points-val">{{ points }}</text>
    </view>

    <view class="records">
      <text class="section-title">积分记录</text>
      <view class="record-item" v-for="r in records" :key="r.id">
        <view class="record-left">
          <text class="record-title">{{ r.title }}</text>
          <text class="record-time">{{ r.time }}</text>
        </view>
        <text class="record-points" :class="{ minus: r.points < 0 }">
          {{ r.points > 0 ? '+' : '' }}{{ r.points }}
        </text>
      </view>
      <empty-state v-if="records.length === 0" text="暂无积分记录" />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPoints } from '../../services/user';
import EmptyState from '../../components/empty-state/empty-state.vue';

const points = ref(0);
const records = ref([]);

onMounted(async () => {
  const data = await getPoints();
  points.value = data.points;
  records.value = data.records;
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}
.points-header {
  background: linear-gradient(135deg, #2878ff, #5b9fff);
  padding: 60rpx 40rpx;
  text-align: center;
  color: #fff;
}
.points-label {
  font-size: 28rpx;
  opacity: 0.85;
  display: block;
}
.points-val {
  font-size: 72rpx;
  font-weight: 700;
  display: block;
  margin-top: 12rpx;
}
.records {
  background: #fff;
  margin: 24rpx;
  border-radius: 20rpx;
  padding: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 20rpx;
}
.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
}
.record-title {
  font-size: 28rpx;
  display: block;
}
.record-time {
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 6rpx;
  display: block;
}
.record-points {
  font-size: 32rpx;
  font-weight: 600;
  color: #22c55e;
}
.record-points.minus {
  color: #ff4d4f;
}
</style>
