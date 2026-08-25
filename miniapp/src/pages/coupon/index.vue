<template>
  <view class="page">
    <u-tabs
      :list="tabs"
      :current="currentTab"
      line-color="#2878FF"
      @change="onTabChange"
    />
    <scroll-view scroll-y class="list">
      <view class="coupon-card" v-for="c in coupons" :key="c.id" :class="c.status">
        <view class="coupon-left">
          <text class="coupon-value" v-if="c.type === 'discount'">¥{{ c.value }}</text>
          <text class="coupon-value" v-else>{{ c.value * 10 }}折</text>
          <text class="coupon-condition">满{{ c.minAmount }}可用</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-name">{{ c.name }}</text>
          <text class="coupon-date">{{ c.startDate }} 至 {{ c.endDate }}</text>
        </view>
      </view>
      <empty-state v-if="coupons.length === 0" text="暂无优惠券" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCoupons } from '../../services/user';
import EmptyState from '../../components/empty-state/empty-state.vue';

const currentTab = ref(0);
const coupons = ref([]);
const statusMap = ['available', 'used', 'expired'];
const tabs = [
  { name: '可使用' },
  { name: '已使用' },
  { name: '已过期' },
];

onMounted(() => loadCoupons());

async function loadCoupons() {
  coupons.value = await getCoupons(statusMap[currentTab.value]);
}

function onTabChange(e) {
  currentTab.value = e.index;
  loadCoupons();
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}
.list {
  height: calc(100vh - 100rpx);
  padding: 24rpx;
  box-sizing: border-box;
}
.coupon-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}
.coupon-card.used, .coupon-card.expired {
  opacity: 0.6;
}
.coupon-left {
  background: linear-gradient(135deg, #2878ff, #5b9fff);
  color: #fff;
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 180rpx;
}
.coupon-value {
  font-size: 40rpx;
  font-weight: 700;
}
.coupon-condition {
  font-size: 22rpx;
  margin-top: 8rpx;
  opacity: 0.85;
}
.coupon-right {
  flex: 1;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.coupon-name {
  font-size: 30rpx;
  font-weight: 600;
}
.coupon-date {
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 8rpx;
}
</style>
