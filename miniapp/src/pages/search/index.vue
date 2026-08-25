<template>
  <view class="page">
    <view class="search-bar">
      <u-search
        v-model="keyword"
        placeholder="搜索课程、教练、场馆"
        :show-action="true"
        action-text="搜索"
        @search="doSearch"
        @custom="doSearch"
        @change="onInput"
      />
    </view>

    <view v-if="!keyword && !searched" class="history">
      <view class="history-header">
        <text class="title">搜索历史</text>
        <text class="clear" @click="clearHistory">清空</text>
      </view>
      <view class="tags">
        <view class="tag" v-for="h in history" :key="h" @click="searchKeyword(h)">{{ h }}</view>
      </view>
    </view>

    <view v-if="searched" class="results">
      <view v-if="results.courses?.length" class="section">
        <text class="section-title">课程</text>
        <course-card v-for="c in results.courses" :key="c.id" :course="c" />
      </view>
      <view v-if="results.coaches?.length" class="section">
        <text class="section-title">教练</text>
        <coach-card v-for="c in results.coaches" :key="c.id" :coach="c" />
      </view>
      <view v-if="results.gyms?.length" class="section">
        <text class="section-title">场馆</text>
        <gym-card v-for="g in results.gyms" :key="g.id" :gym="g" />
      </view>
      <empty-state
        v-if="isEmpty"
        text="未找到相关结果"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { searchAll, getSearchHistory, addSearchHistory, clearSearchHistory } from '../../services/user';
import CourseCard from '../../components/course-card/course-card.vue';
import CoachCard from '../../components/coach-card/coach-card.vue';
import GymCard from '../../components/gym-card/gym-card.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const keyword = ref('');
const history = ref([]);
const results = ref({});
const searched = ref(false);

const isEmpty = computed(() => {
  if (!searched.value) return false;
  const r = results.value;
  return !r.courses?.length && !r.coaches?.length && !r.gyms?.length;
});

onMounted(async () => {
  history.value = await getSearchHistory();
});

function onInput() {
  if (!keyword.value) searched.value = false;
}

async function doSearch() {
  if (!keyword.value.trim()) return;
  searched.value = true;
  results.value = await searchAll(keyword.value);
  history.value = await addSearchHistory(keyword.value);
}

function searchKeyword(kw) {
  keyword.value = kw;
  doSearch();
}

async function clearHistory() {
  history.value = await clearSearchHistory();
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
  padding: 24rpx;
}
.history-header {
  display: flex;
  justify-content: space-between;
  margin: 24rpx 0 16rpx;
}
.title {
  font-size: 30rpx;
  font-weight: 600;
}
.clear {
  font-size: 26rpx;
  color: #8a94a6;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag {
  background: #fff;
  padding: 12rpx 28rpx;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #4b5563;
}
.section {
  margin-top: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}
</style>
