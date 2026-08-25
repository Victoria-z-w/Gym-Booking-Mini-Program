<template>
  <view class="page" v-if="coach">
    <view class="header">
      <image class="avatar" :src="coach.avatar" mode="aspectFill" />
      <text class="name">{{ coach.name }}</text>
      <view class="rating">
        <u-icon name="star-fill" color="#FFB800" size="18" />
        <text>{{ coach.rating }}</text>
      </view>
      <text class="exp">{{ coach.experience }} 年教学经验 · {{ coach.courseCount }} 节课</text>
    </view>

    <view class="card">
      <text class="section-title">个人简介</text>
      <text class="bio">{{ coach.bio }}</text>
    </view>

    <view class="card">
      <text class="section-title">擅长领域</text>
      <view class="tags">
        <u-tag v-for="t in coach.tags" :key="t" :text="t" type="primary" plain />
      </view>
    </view>

    <view class="card">
      <text class="section-title">专业证书</text>
      <view class="certs">
        <text v-for="c in coach.certificates" :key="c" class="cert">{{ c }}</text>
      </view>
    </view>

    <view class="card">
      <text class="section-title">可预约课程</text>
      <course-card v-for="c in coach.courses" :key="c.id" :course="c" />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCoachDetail } from '../../services/coach';
import CourseCard from '../../components/course-card/course-card.vue';

const coach = ref(null);

onMounted(async () => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  const id = Number(page.options?.id);
  coach.value = await getCoachDetail(id);
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding-bottom: 40rpx;
}
.header {
  background: linear-gradient(135deg, #2878ff, #5b9fff);
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
}
.name {
  font-size: 40rpx;
  font-weight: 700;
  margin-top: 20rpx;
}
.rating {
  display: flex;
  align-items: center;
  gap: 6rpx;
  margin-top: 8rpx;
  color: #ffb800;
}
.exp {
  font-size: 26rpx;
  opacity: 0.85;
  margin-top: 8rpx;
}
.card {
  background: #fff;
  margin: 24rpx;
  padding: 24rpx;
  border-radius: 20rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}
.bio {
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.8;
}
.tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}
.certs {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.cert {
  background: #f0f6ff;
  color: #2878ff;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}
</style>
