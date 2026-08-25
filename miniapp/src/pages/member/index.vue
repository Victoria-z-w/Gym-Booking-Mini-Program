<template>
  <view class="page">
    <view class="member-card">
      <view class="card-top">
        <u-icon name="star-fill" color="#FFB800" size="24" />
        <text class="level">{{ userInfo?.memberLevel || '黄金会员' }}</text>
      </view>
      <text class="expire">有效期至 {{ userInfo?.memberExpire }}</text>
      <text class="id">会员编号：{{ userInfo?.memberId }}</text>
    </view>

    <view class="benefits">
      <text class="section-title">会员权益</text>
      <view class="benefit-item" v-for="b in benefits" :key="b.title">
        <u-icon :name="b.icon" color="#2878FF" size="24" />
        <view class="benefit-info">
          <text class="benefit-title">{{ b.title }}</text>
          <text class="benefit-desc">{{ b.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const benefits = [
  { icon: 'coupon', title: '专属优惠', desc: '会员专享课程折扣与优惠券' },
  { icon: 'calendar', title: '优先预约', desc: '热门课程优先预约权' },
  { icon: 'gift', title: '生日礼遇', desc: '生日月专属健身礼包' },
  { icon: 'account', title: '私教折扣', desc: '私教课程享受会员价' },
  { icon: 'integral', title: '积分翻倍', desc: '完成课程积分双倍奖励' },
  { icon: 'home', title: '免费体验', desc: '每月一次免费体验课' },
];

onMounted(() => userStore.fetchUserInfo());
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding: 24rpx;
}
.member-card {
  background: linear-gradient(135deg, #1f2937, #374151);
  border-radius: 24rpx;
  padding: 40rpx;
  color: #fff;
}
.card-top {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.level {
  font-size: 40rpx;
  font-weight: 700;
}
.expire, .id {
  display: block;
  font-size: 26rpx;
  opacity: 0.8;
  margin-top: 16rpx;
}
.benefits {
  background: #fff;
  border-radius: 20rpx;
  margin-top: 24rpx;
  padding: 24rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 24rpx;
}
.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
}
.benefit-title {
  font-size: 28rpx;
  font-weight: 600;
  display: block;
}
.benefit-desc {
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 6rpx;
  display: block;
}
</style>
