<template>
  <view class="page">
    <view v-if="loading" class="loading">
      <u-loading-icon />
    </view>
    <scroll-view v-else scroll-y class="list">
      <view v-for="order in orders" :key="order.id" class="order-card" @tap="goDetail(order)">
        <view class="order-top">
          <text class="order-no">订单号 {{ order.orderNo }}</text>
          <text class="status" :class="order.status">{{ statusLabel(order.status) }}</text>
        </view>
        <view class="order-body">
          <image class="cover" :src="order.courseCover" mode="aspectFill" />
          <view class="info">
            <text class="name">{{ order.courseName }}</text>
            <text class="time">{{ order.createdAt }}</text>
            <text class="pay">{{ order.payMethod }}</text>
          </view>
          <text class="price">¥{{ order.price }}</text>
        </view>
      </view>
      <empty-state
        v-if="orders.length === 0"
        text="暂无订单记录"
        button-text="去预约课程"
        @action="goCourse"
      />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getOrderList } from '../../services/order';
import EmptyState from '../../components/empty-state/empty-state.vue';

const orders = ref([]);
const loading = ref(true);

const statusMap = {
  PAID: '已支付',
  REFUNDED: '已退款',
};

onMounted(async () => {
  try {
    orders.value = await getOrderList();
  } finally {
    loading.value = false;
  }
});

function statusLabel(s) {
  return statusMap[s] || s;
}

function goDetail(order) {
  if (order.bookingId) {
    uni.navigateTo({ url: `/pages/booking/detail?id=${order.bookingId}` });
  }
}

function goCourse() {
  uni.switchTab({ url: '/pages/course/index' });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}
.loading {
  display: flex;
  justify-content: center;
  padding: 120rpx;
}
.list {
  height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
}
.order-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 16rpx rgba(15, 23, 42, 0.04);
}
.order-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
  font-size: 24rpx;
}
.order-no {
  color: #8a94a6;
}
.status {
  font-weight: 600;
}
.status.PAID {
  color: #22c55e;
}
.status.REFUNDED {
  color: #8a94a6;
}
.order-body {
  display: flex;
  align-items: center;
}
.cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.info {
  flex: 1;
  margin: 0 16rpx;
}
.name {
  font-size: 28rpx;
  font-weight: 600;
  display: block;
}
.time, .pay {
  font-size: 24rpx;
  color: #8a94a6;
  display: block;
  margin-top: 6rpx;
}
.price {
  font-size: 32rpx;
  font-weight: 700;
  color: #2878ff;
}
</style>
