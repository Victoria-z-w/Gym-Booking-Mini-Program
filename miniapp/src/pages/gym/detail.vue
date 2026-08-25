<template>
  <view class="page" v-if="gym">
    <swiper class="banner" circular indicator-dots>
      <swiper-item v-for="(img, i) in gym.images" :key="i">
        <image :src="img" mode="aspectFill" class="banner-img" />
      </swiper-item>
    </swiper>

    <view class="info-card">
      <view class="name-row">
        <text class="name">{{ gym.name }}</text>
        <view class="rating">
          <u-icon name="star-fill" color="#FFB800" size="16" />
          <text>{{ gym.rating }}</text>
        </view>
      </view>
      <view class="meta">
        <u-icon name="map" size="16" color="#8A94A6" />
        <text>{{ gym.address }}</text>
      </view>
      <view class="meta">
        <u-icon name="clock" size="16" color="#8A94A6" />
        <text>{{ gym.openTime }} - {{ gym.closeTime }}</text>
      </view>
      <view class="meta">
        <u-icon name="phone" size="16" color="#8A94A6" />
        <text @click="callPhone">{{ gym.phone }}</text>
      </view>
      <view class="tags">
        <u-tag v-for="f in gym.facilities" :key="f" :text="f" size="mini" plain />
      </view>
    </view>

    <view class="section">
      <text class="section-title">场馆课程</text>
      <course-card v-for="c in gym.courses" :key="c.id" :course="c" />
    </view>

    <view class="footer safe-bottom">
      <u-button type="primary" text="查看课程" :custom-style="{ borderRadius: '44rpx', height: '88rpx' }" @click="goCourse" />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGymDetail } from '../../services/gym';
import CourseCard from '../../components/course-card/course-card.vue';

const gym = ref(null);

onMounted(async () => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  const id = Number(page.options?.id);
  gym.value = await getGymDetail(id);
});

function callPhone() {
  uni.makePhoneCall({ phoneNumber: gym.value.phone });
}

function goCourse() {
  uni.switchTab({ url: '/pages/course/index' });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding-bottom: 140rpx;
}
.banner {
  height: 400rpx;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.info-card {
  background: #fff;
  margin: -40rpx 24rpx 24rpx;
  padding: 28rpx;
  border-radius: 20rpx;
  position: relative;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}
.name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.name {
  font-size: 36rpx;
  font-weight: 700;
}
.rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #ffb800;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
  color: #8a94a6;
  margin-top: 16rpx;
}
.tags {
  display: flex;
  gap: 8rpx;
  margin-top: 20rpx;
  flex-wrap: wrap;
}
.section {
  padding: 0 24rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  background: #fff;
}
</style>
