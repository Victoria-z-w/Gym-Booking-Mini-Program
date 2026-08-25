<template>
  <view class="gym-card" @click="handleClick">
    <image class="cover" :src="gym.cover" mode="aspectFill" />
    <view class="info">
      <view class="name-row">
        <text class="name">{{ gym.name }}</text>
        <view class="rating">
          <u-icon name="star-fill" color="#FFB800" size="14" />
          <text>{{ gym.rating }}</text>
        </view>
      </view>
      <view class="meta">
        <u-icon name="map" color="#8A94A6" size="14" />
        <text>{{ gym.distance }} · {{ gym.address }}</text>
      </view>
      <view class="meta">
        <u-icon name="clock" color="#8A94A6" size="14" />
        <text>{{ gym.openTime }} - {{ gym.closeTime }}</text>
      </view>
      <view class="tags">
        <u-tag
          v-for="f in gym.facilities.slice(0, 4)"
          :key="f"
          :text="f"
          size="mini"
          plain
        />
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  gym: { type: Object, required: true },
});

function handleClick() {
  uni.navigateTo({ url: `/pages/gym/detail?id=${props.gym.id}` });
}
</script>

<style lang="scss" scoped>
.gym-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.cover {
  width: 100%;
  height: 280rpx;
}
.info {
  padding: 24rpx;
}
.name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.name {
  font-size: 32rpx;
  font-weight: 600;
}
.rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #ffb800;
  font-size: 24rpx;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 12rpx;
}
.tags {
  display: flex;
  gap: 8rpx;
  margin-top: 16rpx;
  flex-wrap: wrap;
}
</style>
