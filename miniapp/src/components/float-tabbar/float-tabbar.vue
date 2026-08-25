<template>
  <view class="float-tabbar-wrap">
    <view class="float-tabbar">
      <view
        v-for="(tab, index) in tabs"
        :key="tab.path"
        class="tab-item"
        :class="{ active: current === index }"
        @tap="onTap(index)"
      >
        <view class="tab-icon" :class="{ active: current === index }">
          <u-icon
            :name="tab.icon"
            :color="current === index ? '#2878FF' : '#94A3B8'"
            size="24"
          />
        </view>
        <text class="tab-text" :class="{ active: current === index }">{{ tab.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  current: { type: Number, default: 0 },
});

const tabs = [
  { path: '/pages/home/index', text: '首页', icon: 'home' },
  { path: '/pages/course/index', text: '课程', icon: 'grid' },
  { path: '/pages/booking/index', text: '预约', icon: 'calendar' },
  { path: '/pages/profile/index', text: '我的', icon: 'account' },
];

function onTap(index) {
  if (index === props.current) return;
  uni.switchTab({ url: tabs[index].path });
}
</script>

<style lang="scss" scoped>
.float-tabbar-wrap {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: calc(20rpx + constant(safe-area-inset-bottom));
  bottom: calc(20rpx + env(safe-area-inset-bottom));
  z-index: 999;
  pointer-events: none;
}

.float-tabbar {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 120rpx;
  background: #ffffff;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120rpx;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: scale(1) translateY(0);
}

.tab-icon.active {
  transform: scale(1.1) translateY(-6rpx);
}

.tab-text {
  font-size: 22rpx;
  color: #64748b;
  margin-top: 6rpx;
  line-height: 1;
  transition: color 0.2s ease;
}

.tab-text.active {
  color: #2878ff;
  font-weight: 600;
}
</style>
