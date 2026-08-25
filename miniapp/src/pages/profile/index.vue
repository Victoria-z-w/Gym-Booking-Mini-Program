<template>
  <view class="profile-page">
    <scroll-view scroll-y class="scroll-body" :show-scrollbar="false">
      <!-- 顶部会员区域 -->
      <view class="hero animate-header" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="hero-inner">
          <view class="user-row">
            <image class="avatar" :src="userInfo?.avatar" mode="aspectFill" />
            <view class="user-main">
              <text class="nickname">{{ userInfo?.nickname || '健身用户' }}</text>
              <view class="member-tag">
                <u-icon name="star-fill" color="#FFB800" size="12" />
                <text>{{ userInfo?.memberLevel || '黄金会员' }}</text>
              </view>
              <text class="meta-line">ID: {{ userInfo?.memberId || '—' }}</text>
              <text class="meta-line">有效期至 {{ userInfo?.memberExpire || '—' }}</text>
            </view>
            <view class="level-box">
              <text class="level-label">会员等级</text>
              <text class="level-val">Lv.{{ displayLevel }}</text>
              <view class="progress-wrap">
                <view class="progress-bar">
                  <view class="progress-fill" :style="{ width: growthPercent + '%' }" />
                </view>
                <text class="progress-text">{{ growthCurrent }} / {{ growthTarget }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 浮动数据卡片 -->
      <view class="stats-card animate-stats">
        <view class="stat-item" @tap="goPoints">
          <text class="stat-num">{{ userInfo?.points || 0 }}</text>
          <text class="stat-label">积分</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="goCourse">
          <text class="stat-num">{{ userInfo?.remainingCourses || 0 }}</text>
          <text class="stat-label">剩余课程</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item" @tap="goCoupon">
          <text class="stat-num">{{ userInfo?.couponCount || 0 }}</text>
          <text class="stat-label">优惠券</text>
        </view>
      </view>

      <!-- 会员权益 -->
      <view class="vip-card animate-card" @tap="goMember">
        <view class="vip-left">
          <text class="vip-title">会员专享</text>
          <text class="vip-sub">享受更多会员权益</text>
        </view>
        <view class="vip-btn">查看权益</view>
      </view>

      <!-- 功能菜单（分组） -->
      <view class="menu-section animate-menu">
        <view
          v-for="(group, gIndex) in menuGroups"
          :key="group.key"
          class="menu-card"
          :class="'menu-group-delay-' + gIndex"
        >
          <template v-for="(item, index) in group.items" :key="item.name">
            <button
              v-if="item.share"
              class="menu-item share-btn"
              open-type="share"
            >
              <view class="icon-wrap">
                <u-icon :name="item.icon" color="#64748B" size="18" />
              </view>
              <view class="menu-row" :class="{ 'menu-row-border': index < group.items.length - 1 }">
                <text class="menu-name">{{ item.name }}</text>
                <u-icon name="arrow-right" color="#CBD5E1" size="14" />
              </view>
            </button>
            <view
              v-else
              class="menu-item"
              @tap="goPage(item.path)"
            >
              <view class="icon-wrap">
                <u-icon
                  :name="item.icon"
                  :color="item.primary ? '#2878FF' : '#64748B'"
                  size="18"
                />
              </view>
              <view class="menu-row" :class="{ 'menu-row-border': index < group.items.length - 1 }">
                <text class="menu-name">{{ item.name }}</text>
                <u-icon name="arrow-right" color="#CBD5E1" size="14" />
              </view>
            </view>
          </template>
        </view>
      </view>

      <view class="scroll-bottom tabbar-spacer" />
    </scroll-view>

    <float-tabbar :current="3" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onShow, onShareAppMessage } from '@dcloudio/uni-app';
import { useUserStore } from '../../store/user';
import { hideNativeTabBar } from '../../utils/tabbar';
import FloatTabbar from '../../components/float-tabbar/float-tabbar.vue';

const userStore = useUserStore();
const statusBarHeight = ref(20);
const userInfo = computed(() => userStore.userInfo);

// 展示用成长数据（不改变业务接口）
const displayLevel = 3;
const growthCurrent = 3200;
const growthTarget = 5000;
const growthPercent = computed(() =>
  Math.min(100, Math.round((growthCurrent / growthTarget) * 100))
);

const menuGroups = [
  {
    key: 'order',
    items: [
      { name: '我的订单', icon: 'file-text', path: '/pages/orders/index' },
      { name: '我的预约', icon: 'calendar', path: '/pages/booking/index', primary: true },
    ],
  },
  {
    key: 'assets',
    items: [
      { name: '优惠券', icon: 'coupon', path: '/pages/coupon/index' },
      { name: '我的积分', icon: 'integral', path: '/pages/points/index' },
      { name: '收藏课程', icon: 'star', path: '/pages/favorites/index' },
      { name: '我的教练', icon: 'account', path: '/pages/coach/index' },
      { name: '会员卡', icon: 'gift', path: '/pages/member/index' },
    ],
  },
  {
    key: 'more',
    items: [
      { name: '邀请好友', icon: 'share', path: '', share: true },
      { name: '帮助与反馈', icon: 'question-circle', path: '/pages/help/index' },
      { name: '设置', icon: 'setting', path: '/pages/settings/index' },
    ],
  },
];

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 20;
  hideNativeTabBar();
});

onShow(() => {
  hideNativeTabBar();
  userStore.fetchUserInfo();
});

onShareAppMessage(() => ({
  title: '动感健身预约 - 开启蜕变之旅',
  path: '/pages/home/index',
}));

function goPage(path) {
  if (!path) return;
  if (path === '/pages/booking/index') {
    uni.switchTab({ url: path });
  } else {
    uni.navigateTo({ url: path });
  }
}

function goPoints() {
  uni.navigateTo({ url: '/pages/points/index' });
}

function goCoupon() {
  uni.navigateTo({ url: '/pages/coupon/index' });
}

function goCourse() {
  uni.switchTab({ url: '/pages/course/index' });
}

function goMember() {
  uni.navigateTo({ url: '/pages/member/index' });
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #f6f8fb;
}

.scroll-body {
  height: 100vh;
  box-sizing: border-box;
}

/* 顶部会员区 */
.hero {
  min-height: 280rpx;
  background: linear-gradient(135deg, #1677ff, #4d9cff);
  border-radius: 0 0 48rpx 48rpx;
  padding-bottom: 72rpx;
  box-sizing: border-box;
}

.hero-inner {
  padding: 24rpx 32rpx 0;
}

.user-row {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.user-main {
  flex: 1;
  min-width: 0;
  color: #fff;
}

.nickname {
  font-size: 34rpx;
  font-weight: 700;
  line-height: 1.3;
  display: block;
}

.member-tag {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  margin-top: 10rpx;
  padding: 6rpx 16rpx;
  background: linear-gradient(135deg, #ffd666, #ffb800);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #5c3d00;
  font-weight: 600;
}

.meta-line {
  display: block;
  font-size: 22rpx;
  opacity: 0.88;
  margin-top: 8rpx;
  line-height: 1.4;
}

.level-box {
  flex-shrink: 0;
  text-align: right;
  color: #fff;
  max-width: 200rpx;
}

.level-label {
  font-size: 20rpx;
  opacity: 0.85;
  display: block;
}

.level-val {
  font-size: 36rpx;
  font-weight: 800;
  display: block;
  margin-top: 4rpx;
  line-height: 1.2;
}

.progress-wrap {
  margin-top: 12rpx;
}

.progress-bar {
  width: 160rpx;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 8rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #fff;
  border-radius: 8rpx;
  transition: width 0.6s ease;
}

.progress-text {
  font-size: 18rpx;
  opacity: 0.9;
  margin-top: 6rpx;
  display: block;
}

/* 浮动数据卡 */
.stats-card {
  display: flex;
  align-items: center;
  height: 120rpx;
  margin: -56rpx 24rpx 0;
  padding: 0 8rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 12rpx 40rpx rgba(22, 119, 255, 0.12);
  position: relative;
  z-index: 2;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 6rpx;
}

.stat-divider {
  width: 1rpx;
  height: 48rpx;
  background: #eef0f4;
  flex-shrink: 0;
}

/* 会员权益 */
.vip-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24rpx 24rpx 0;
  padding: 28rpx 32rpx;
  background: linear-gradient(135deg, #1a1f36, #2d3748);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(26, 31, 54, 0.25);
}

.vip-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
  display: block;
}

.vip-sub {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 8rpx;
  display: block;
}

.vip-btn {
  flex-shrink: 0;
  padding: 14rpx 28rpx;
  background: #fff;
  color: #1f2937;
  font-size: 24rpx;
  font-weight: 600;
  border-radius: 32rpx;
}

/* 功能菜单 */
.menu-section {
  margin: 24rpx 24rpx 0;
}

.menu-card {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(15, 23, 42, 0.04);
}

.menu-card + .menu-card {
  margin-top: 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  height: 100rpx;
  padding-left: 28rpx;
  padding-right: 28rpx;
}

.icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  background: #f3f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-row {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20rpx;
  min-height: 100rpx;
  padding-right: 4rpx;
}

.menu-row-border {
  border-bottom: 1rpx solid #f1f5f9;
}

.menu-name {
  font-size: 28rpx;
  color: #334155;
  font-weight: 400;
  line-height: 1.4;
}

.share-btn {
  width: 100%;
  margin: 0;
  padding: 0 0 0 28rpx;
  background: transparent;
  border: none;
  border-radius: 0;
  line-height: normal;
  text-align: left;
}

.share-btn::after {
  border: none;
}

/* 入场动画 */
@keyframes fadeSlideDown {
  from {
    opacity: 0;
    transform: translateY(-24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(32rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes menuItemIn {
  from {
    opacity: 0;
    transform: translateX(-16rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-header {
  animation: fadeSlideDown 0.55s ease-out both;
}

.animate-stats {
  animation: fadeSlideUp 0.55s ease-out 0.1s both;
}

.animate-card {
  animation: fadeSlideUp 0.55s ease-out 0.2s both;
}

.animate-menu {
  animation: fadeSlideUp 0.5s ease-out 0.28s both;
}

.menu-group-delay-0 { animation: menuItemIn 0.4s ease-out 0.35s both; }
.menu-group-delay-1 { animation: menuItemIn 0.4s ease-out 0.42s both; }
.menu-group-delay-2 { animation: menuItemIn 0.4s ease-out 0.49s both; }
</style>
