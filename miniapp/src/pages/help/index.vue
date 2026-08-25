<template>
  <view class="page">
    <view class="faq" v-for="(item, i) in faqs" :key="i">
      <text class="question">Q: {{ item.q }}</text>
      <text class="answer">A: {{ item.a }}</text>
    </view>

    <view class="feedback">
      <text class="section-title">意见反馈</text>
      <u-textarea v-model="feedback" placeholder="请输入您的意见或建议..." />
      <u-button type="primary" text="提交反馈" :custom-style="{ borderRadius: '40rpx', marginTop: '24rpx' }" @click="submit" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const feedback = ref('');
const faqs = [
  { q: '如何预约课程？', a: '在首页或课程页选择课程，点击立即预约，选择日期和时间后确认即可。' },
  { q: '如何取消预约？', a: '在"我的预约"中找到待上课的课程，点击取消预约即可。' },
  { q: '预约后可以退款吗？', a: '开课前2小时可免费取消，超时取消可能扣除部分费用。' },
  { q: '会员有什么权益？', a: '会员可享受课程折扣、优先预约、积分翻倍等专属权益。' },
];

function submit() {
  if (!feedback.value.trim()) {
    uni.showToast({ title: '请输入反馈内容', icon: 'none' });
    return;
  }
  uni.showToast({ title: '反馈已提交', icon: 'success' });
  feedback.value = '';
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding: 24rpx;
}
.faq {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}
.question {
  font-size: 28rpx;
  font-weight: 600;
  display: block;
}
.answer {
  font-size: 26rpx;
  color: #8a94a6;
  margin-top: 12rpx;
  display: block;
  line-height: 1.6;
}
.feedback {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-top: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}
</style>
