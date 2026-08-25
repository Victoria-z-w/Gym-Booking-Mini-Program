<template>
  <view class="page">
    <scroll-view scroll-y class="list">
      <gym-card v-for="g in gyms" :key="g.id" :gym="g" />
      <empty-state v-if="gyms.length === 0" text="暂无场馆" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGymList } from '../../services/gym';
import GymCard from '../../components/gym-card/gym-card.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const gyms = ref([]);

onMounted(async () => {
  gyms.value = await getGymList();
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
