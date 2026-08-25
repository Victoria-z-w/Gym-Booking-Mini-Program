<template>
  <view class="page">
    <view class="menu-card">
      <view class="menu-item">
        <text>消息通知</text>
        <u-switch v-model="notify" />
      </view>
      <view class="menu-item">
        <text>清除缓存</text>
        <u-button text="清除" size="mini" @click="clearCache" />
      </view>
      <view class="menu-item" @click="goPrivacy">
        <text>隐私政策</text>
        <u-icon name="arrow-right" color="#C0C8D4" size="14" />
      </view>
      <view class="menu-item">
        <text>关于我们</text>
        <text class="version">v1.0.0</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const notify = ref(true);

function clearCache() {
  uni.removeStorageSync('searchHistory');
  uni.showToast({ title: '缓存已清除', icon: 'success' });
}

function goPrivacy() {
  uni.navigateTo({ url: '/pages/privacy/index' });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding: 24rpx;
}
.menu-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 28rpx;
  border-bottom: 1rpx solid #f6f8fb;
  font-size: 28rpx;
}
.version {
  color: #8a94a6;
  font-size: 26rpx;
}
</style>
