<template>
  <view class="page" v-if="course">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back" @click="goBack">
          <u-icon name="arrow-left" color="#fff" size="20" />
        </view>
        <view class="fav" @click="toggleFav">
          <u-icon :name="course.isFavorite ? 'star-fill' : 'star'" :color="course.isFavorite ? '#FFB800' : '#fff'" size="22" />
        </view>
      </view>
    </view>

    <image class="cover" :src="course.cover" mode="aspectFill" />

    <view class="content">
      <view class="title-section">
        <text class="title">{{ course.name }}</text>
        <view class="rating-row">
          <u-icon name="star-fill" color="#FFB800" size="16" />
          <text class="rating">{{ course.rating }}</text>
          <text class="reviews">{{ course.reviewCount }} 条评价</text>
        </view>
        <view class="tags">
          <u-tag v-for="tag in course.tags" :key="tag" :text="tag" size="mini" type="primary" plain />
        </view>
      </view>

      <view class="coach-card" @click="goCoach">
        <image class="coach-avatar" :src="course.coach?.avatar" mode="aspectFill" />
        <view class="coach-info">
          <text class="coach-name">{{ course.coach?.name }}</text>
          <text class="coach-exp">{{ course.coach?.experience }} 年教学经验</text>
          <text class="coach-spec">{{ course.coach?.specialty }}</text>
        </view>
        <u-button text="查看教练" size="mini" type="primary" plain :custom-style="{ borderRadius: '24rpx' }" />
      </view>

      <view class="stats">
        <view class="stat-item">
          <u-icon name="clock" color="#2878FF" size="24" />
          <text class="stat-val">{{ course.duration }} 分钟</text>
          <text class="stat-label">课程时长</text>
        </view>
        <view class="stat-item">
          <u-icon name="fire" color="#FF7A45" size="24" />
          <text class="stat-val">{{ course.calories }} kcal</text>
          <text class="stat-label">预计消耗</text>
        </view>
        <view class="stat-item">
          <u-icon name="level" color="#22C55E" size="24" />
          <text class="stat-val">{{ course.difficulty }}</text>
          <text class="stat-label">课程强度</text>
        </view>
        <view class="stat-item">
          <u-icon name="account" color="#A855F7" size="24" />
          <text class="stat-val">20 人</text>
          <text class="stat-label">课程人数</text>
        </view>
      </view>

      <view class="desc-section">
        <text class="section-title">课程简介</text>
        <text class="desc">{{ course.description }}</text>
      </view>
    </view>

    <view class="footer safe-bottom">
      <view class="price">
        <text class="price-val">¥{{ course.price }}</text>
        <text class="price-unit">/ 次</text>
      </view>
      <u-button
        type="primary"
        text="立即预约"
        :custom-style="{ borderRadius: '44rpx', width: '320rpx', height: '88rpx' }"
        @click="goBooking"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCourseDetail } from '../../services/course';
import { toggleFavorite } from '../../services/user';

const course = ref(null);
const statusBarHeight = ref(20);
let courseId = 0;

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  statusBarHeight.value = sys.statusBarHeight || 20;
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  courseId = Number(page.options?.id);
  loadDetail();
});

async function loadDetail() {
  try {
    course.value = await getCourseDetail(courseId);
  } catch (e) {
    console.error(e);
  }
}

async function toggleFav() {
  const res = await toggleFavorite(courseId);
  course.value.isFavorite = res.isFavorite;
  uni.showToast({ title: res.isFavorite ? '已收藏' : '已取消收藏', icon: 'none' });
}

function goBack() {
  uni.navigateBack();
}

function goCoach() {
  uni.navigateTo({ url: `/pages/coach/detail?id=${course.value.coachId}` });
}

function goBooking() {
  uni.navigateTo({ url: `/pages/booking/select?courseId=${courseId}` });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding-bottom: 140rpx;
}
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.nav-content {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 24rpx;
}
.back, .fav {
  width: 64rpx;
  height: 64rpx;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover {
  width: 100%;
  height: 500rpx;
}
.content {
  margin-top: -40rpx;
  position: relative;
  z-index: 1;
}
.title-section {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 32rpx 24rpx;
}
.title {
  font-size: 40rpx;
  font-weight: 700;
  display: block;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 12rpx;
}
.rating {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffb800;
}
.reviews {
  font-size: 24rpx;
  color: #8a94a6;
}
.tags {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
  flex-wrap: wrap;
}
.coach-card {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 16rpx 24rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}
.coach-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}
.coach-info {
  flex: 1;
  margin: 0 20rpx;
}
.coach-name {
  font-size: 30rpx;
  font-weight: 600;
  display: block;
}
.coach-exp, .coach-spec {
  font-size: 24rpx;
  color: #8a94a6;
  display: block;
  margin-top: 4rpx;
}
.stats {
  display: flex;
  background: #fff;
  margin: 0 24rpx;
  padding: 32rpx 16rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.stat-val {
  font-size: 28rpx;
  font-weight: 600;
}
.stat-label {
  font-size: 22rpx;
  color: #8a94a6;
}
.desc-section {
  background: #fff;
  margin: 16rpx 24rpx;
  padding: 24rpx;
  border-radius: 20rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}
.desc {
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.8;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}
.price-val {
  font-size: 40rpx;
  font-weight: 700;
  color: #2878ff;
}
.price-unit {
  font-size: 24rpx;
  color: #8a94a6;
}
</style>
