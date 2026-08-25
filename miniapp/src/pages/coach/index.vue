<template>
  <view class="page">
    <scroll-view scroll-y class="list">
      <coach-card v-for="c in coaches" :key="c.id" :coach="c" />
      <empty-state v-if="coaches.length === 0" text="暂无教练" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCoachList } from '../../services/coach';
import CoachCard from '../../components/coach-card/coach-card.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const coaches = ref([]);

onMounted(async () => {
  coaches.value = await getCoachList();
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}
.list {
  height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
}
</style>
