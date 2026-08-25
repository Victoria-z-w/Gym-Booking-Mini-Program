<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
    <view class="header">
      <view class="city" @click="showCityPicker = true">
        <u-icon name="map-fill" color="#2878FF" size="16" />
        <text>{{ userStore.city }}</text>
        <u-icon name="arrow-down" size="12" color="#8A94A6" />
      </view>
      <view class="search-bar" @click="goSearch">
        <u-icon name="search" color="#8A94A6" size="18" />
        <text class="placeholder">搜索课程、教练、场馆</text>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="scroll-content"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="banner-wrap">
        <swiper
          class="banner-swiper"
          circular
          autoplay
          indicator-dots
          indicator-color="rgba(255,255,255,0.4)"
          indicator-active-color="#fff"
        >
          <swiper-item v-for="item in banners" :key="item.id">
            <view class="banner-item">
              <image class="banner-img" :src="item.image" mode="aspectFill" />
              <view class="banner-mask">
                <text class="banner-title">{{ item.title }}</text>
                <text class="banner-sub">{{ item.subtitle }}</text>
                <view class="banner-btn" @click="goCourse">立即预约</view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <view class="grid-menu">
        <view class="grid-item" v-for="item in menus" :key="item.name" @click="goPage(item.path)">
          <view class="icon-wrap" :style="{ background: item.bg }">
            <u-icon :name="item.icon" color="#fff" size="28" />
          </view>
          <text class="grid-name">{{ item.name }}</text>
          <text class="grid-sub">{{ item.sub }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">热门课程</text>
          <text class="more" @click="goCourse">更多 ></text>
        </view>
        <view v-if="loading" class="skeleton-wrap">
          <u-skeleton v-for="i in 3" :key="i" rows="3" title loading />
        </view>
        <course-card v-else v-for="c in hotCourses" :key="c.id" :course="c" />
        <empty-state
          v-if="!loading && hotCourses.length === 0"
          text="暂无热门课程"
          button-text="浏览课程"
          @action="goCourse"
        />
      </view>
      <view class="bottom-safe tabbar-spacer" />
    </scroll-view>

    <u-action-sheet
      :show="showCityPicker"
      :actions="cityActions"
      title="选择城市"
      @close="showCityPicker = false"
      @select="onCitySelect"
    />
    <float-tabbar :current="0" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '../../store/user';
import { hideNativeTabBar } from '../../utils/tabbar';
import FloatTabbar from '../../components/float-tabbar/float-tabbar.vue';
import { getBanners, getHotCourses } from '../../services/course';
import CourseCard from '../../components/course-card/course-card.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const userStore = useUserStore();
const statusBarHeight = ref(20);
const banners = ref([]);
const hotCourses = ref([]);
const loading = ref(true);
const refreshing = ref(false);
const showCityPicker = ref(false);

const menus = [
  { name: '课程预约', sub: '团课精选', icon: 'calendar', bg: 'linear-gradient(135deg,#2878FF,#5B9FFF)', path: '/pages/course/index' },
  { name: '私教预约', sub: '一对一', icon: 'account', bg: 'linear-gradient(135deg,#22C55E,#4ADE80)', path: '/pages/coach/index' },
  { name: '场馆预约', sub: '附近场馆', icon: 'home', bg: 'linear-gradient(135deg,#FF7A45,#FFA07A)', path: '/pages/gym/index' },
  { name: '会员中心', sub: '专属权益', icon: 'star', bg: 'linear-gradient(135deg,#A855F7,#C084FC)', path: '/pages/member/index' },
];

const cityActions = computed(() =>
  userStore.cities.map((c) => ({ name: c }))
);

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 20;
  userStore.fetchUserInfo();
  loadData();
  hideNativeTabBar();
});

onShow(() => {
  hideNativeTabBar();
});

async function loadData() {
  loading.value = true;
  try {
    const [b, c] = await Promise.all([getBanners(), getHotCourses()]);
    banners.value = b;
    hotCourses.value = c;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function onRefresh() {
  refreshing.value = true;
  await loadData();
  refreshing.value = false;
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' });
}

function goCourse() {
  uni.switchTab({ url: '/pages/course/index' });
}

function goPage(path) {
  if (path.includes('course') || path.includes('booking') || path.includes('profile')) {
    if (path === '/pages/course/index') {
      uni.switchTab({ url: path });
    } else {
      uni.navigateTo({ url: path });
    }
  } else {
    uni.navigateTo({ url: path });
  }
}

function onCitySelect(e) {
  userStore.setCity(e.name);
  showCityPicker.value = false;
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}
.header {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #fff;
  gap: 16rpx;
}
.city {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 28rpx;
  font-weight: 500;
  flex-shrink: 0;
}
.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f6f8fb;
  border-radius: 40rpx;
  padding: 16rpx 24rpx;
  gap: 12rpx;
}
.placeholder {
  font-size: 26rpx;
  color: #8a94a6;
}
.scroll-content {
  height: calc(100vh - 120rpx);
}
.banner-wrap {
  padding: 24rpx;
}
.banner-swiper {
  height: 320rpx;
  border-radius: 24rpx;
  overflow: hidden;
}
.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.banner-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 32rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}
.banner-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}
.banner-sub {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 8rpx;
}
.banner-btn {
  display: inline-block;
  margin-top: 20rpx;
  background: #2878ff;
  color: #fff;
  font-size: 26rpx;
  padding: 12rpx 36rpx;
  border-radius: 32rpx;
}
.grid-menu {
  display: flex;
  padding: 0 24rpx 24rpx;
  gap: 16rpx;
}
.grid-item {
  flex: 1;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}
.icon-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.grid-name {
  font-size: 26rpx;
  font-weight: 600;
  margin-top: 12rpx;
}
.grid-sub {
  font-size: 20rpx;
  color: #8a94a6;
  margin-top: 4rpx;
}
.section {
  padding: 0 24rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 700;
}
.more {
  font-size: 26rpx;
  color: #8a94a6;
}
.skeleton-wrap {
  padding: 20rpx 0;
}
</style>
