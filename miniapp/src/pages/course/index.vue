<template>
  <view class="page">
    <view class="filters">
      <scroll-view scroll-x class="filter-scroll">
        <view
          v-for="cat in categories"
          :key="cat"
          class="filter-tag"
          :class="{ active: category === cat }"
          @click="category = cat; loadCourses()"
        >{{ cat }}</view>
      </scroll-view>
      <view class="sub-filters">
        <view class="sub-filter" @click="showDifficulty = true">
          <text>{{ difficulty }}</text>
          <u-icon name="arrow-down" size="12" />
        </view>
        <view class="sub-filter" @click="showTime = true">
          <text>{{ timeFilter || '时间' }}</text>
          <u-icon name="arrow-down" size="12" />
        </view>
        <view class="sub-filter" @click="showSort = true">
          <text>{{ sort }}</text>
          <u-icon name="arrow-down" size="12" />
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="list tabbar-padding" @scrolltolower="loadMore">
      <view v-if="loading" class="loading-wrap">
        <u-skeleton v-for="i in 4" :key="i" rows="3" title loading />
      </view>
      <course-card v-else v-for="c in courses" :key="c.id" :course="c" />
      <empty-state
        v-if="!loading && courses.length === 0"
        text="暂无课程"
        button-text="返回首页"
        @action="goHome"
      />
    </scroll-view>

    <u-action-sheet :show="showDifficulty" :actions="diffActions" @close="showDifficulty = false" @select="onDifficulty" />
    <u-action-sheet :show="showTime" :actions="timeActions" @close="showTime = false" @select="onTime" />
    <u-action-sheet :show="showSort" :actions="sortActions" @close="showSort = false" @select="onSort" />
    <float-tabbar :current="1" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getCourseList } from '../../services/course';
import { hideNativeTabBar } from '../../utils/tabbar';
import FloatTabbar from '../../components/float-tabbar/float-tabbar.vue';
import { COURSE_CATEGORIES, DIFFICULTIES, TIME_FILTERS, SORT_OPTIONS } from '../../utils/constants';
import CourseCard from '../../components/course-card/course-card.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const categories = COURSE_CATEGORIES;
const category = ref('全部');
const difficulty = ref('全部');
const timeFilter = ref('');
const sort = ref('综合排序');
const courses = ref([]);
const loading = ref(true);
const showDifficulty = ref(false);
const showTime = ref(false);
const showSort = ref(false);

const diffActions = DIFFICULTIES.map((d) => ({ name: d }));
const timeActions = [{ name: '全部' }, ...TIME_FILTERS.map((t) => ({ name: t }))];
const sortActions = SORT_OPTIONS.map((s) => ({ name: s }));

onMounted(() => {
  loadCourses();
  hideNativeTabBar();
});

onShow(() => {
  hideNativeTabBar();
});

async function loadCourses() {
  loading.value = true;
  try {
    courses.value = await getCourseList({
      category: category.value,
      difficulty: difficulty.value,
      timeFilter: timeFilter.value === '全部' ? '' : timeFilter.value,
      sort: sort.value,
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function onDifficulty(e) {
  difficulty.value = e.name;
  showDifficulty.value = false;
  loadCourses();
}

function onTime(e) {
  timeFilter.value = e.name === '全部' ? '' : e.name;
  showTime.value = false;
  loadCourses();
}

function onSort(e) {
  sort.value = e.name;
  showSort.value = false;
  loadCourses();
}

function loadMore() {}
function goHome() {
  uni.switchTab({ url: '/pages/home/index' });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}
.filters {
  background: #fff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.filter-scroll {
  white-space: nowrap;
  padding: 0 24rpx;
}
.filter-tag {
  display: inline-block;
  padding: 12rpx 28rpx;
  margin-right: 16rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #8a94a6;
  background: #f6f8fb;
}
.filter-tag.active {
  background: #e8f1ff;
  color: #2878ff;
  font-weight: 600;
}
.sub-filters {
  display: flex;
  padding: 16rpx 24rpx 0;
  gap: 24rpx;
}
.sub-filter {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 26rpx;
  color: #1f2937;
}
.list {
  height: calc(100vh - 200rpx);
  padding: 24rpx;
  box-sizing: border-box;
}
.loading-wrap {
  padding: 20rpx 0;
}
</style>
