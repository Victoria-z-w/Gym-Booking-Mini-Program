<template>
  <view class="coach-card" @click="handleClick">
    <image class="avatar" :src="coach.avatar" mode="aspectFill" />
    <view class="info">
      <view class="name-row">
        <text class="name">{{ coach.name }}</text>
        <view class="rating">
          <u-icon name="star-fill" color="#FFB800" size="14" />
          <text>{{ coach.rating }}</text>
        </view>
      </view>
      <text class="exp">{{ coach.experience }} 年经验 · {{ coach.courseCount }} 节课</text>
      <view class="tags">
        <u-tag
          v-for="tag in coach.tags.slice(0, 3)"
          :key="tag"
          :text="tag"
          size="mini"
          plain
          type="primary"
        />
      </view>
    </view>
    <u-button
      type="primary"
      size="small"
      text="立即预约"
      :custom-style="{ borderRadius: '32rpx', height: '56rpx' }"
      @click.stop="handleBook"
    />
  </view>
</template>

<script setup>
const props = defineProps({
  coach: { type: Object, required: true },
});

function handleClick() {
  uni.navigateTo({ url: `/pages/coach/detail?id=${props.coach.id}` });
}

function handleBook() {
  uni.navigateTo({ url: `/pages/coach/detail?id=${props.coach.id}` });
}
</script>

<style lang="scss" scoped>
.coach-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  flex-shrink: 0;
}
.info {
  flex: 1;
  margin: 0 20rpx;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.name {
  font-size: 30rpx;
  font-weight: 600;
}
.rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  color: #ffb800;
}
.exp {
  font-size: 24rpx;
  color: #8a94a6;
  margin: 8rpx 0;
  display: block;
}
.tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}
</style>
