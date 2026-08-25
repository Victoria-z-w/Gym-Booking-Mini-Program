<template>
  <view class="page">
    <scroll-view scroll-y class="list">
      <course-card v-for="c in courses" :key="c.id" :course="c" />
      <empty-state
        v-if="courses.length === 0"
        text="暂无收藏课程"
        button-text="去浏览课程"
        @action="goCourse"
      />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFavorites } from '../../services/user';
import CourseCard from '../../components/course-card/course-card.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const courses = ref([]);

onMounted(async () => {
  courses.value = await getFavorites();
});

function goCourse() {
  uni.switchTab({ url: '/pages/course/index' });
}
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
