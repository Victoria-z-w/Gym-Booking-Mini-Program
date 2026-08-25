<template>
  <view class="empty-state">
    <u-icon :name="icon" size="80" color="#C0C8D4" />
    <text class="text">{{ text }}</text>
    <u-button
      v-if="buttonText"
      :text="buttonText"
      type="primary"
      :custom-style="{ borderRadius: '40rpx', marginTop: '32rpx', width: '280rpx' }"
      @click="$emit('action')"
    />
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'file-text' },
  text: { type: String, default: '暂无数据' },
  buttonText: { type: String, default: '' },
});

defineEmits(['action']);
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
}
.text {
  font-size: 28rpx;
  color: #8a94a6;
  margin-top: 24rpx;
}
</style>
