<template>
  <view class="page">
    <u-tabs
      :list="tabs"
      :current="currentTab"
      line-color="#2878FF"
      active-color="#2878FF"
      @change="onTabChange"
    />

    <scroll-view scroll-y class="list tabbar-padding">
      <view v-if="loading" class="loading">
        <u-loading-icon />
      </view>
      <booking-card
        v-for="b in bookings"
        :key="b.id"
        :booking="b"
        @cancel="onCancel"
        @review="onReview"
      />
      <empty-state
        v-if="!loading && bookings.length === 0"
        :text="emptyText"
        button-text="去预约课程"
        @action="goCourse"
      />
    </scroll-view>

    <u-modal
      :show="showCancel"
      title="取消预约"
      content="确定取消该课程预约吗？"
      :show-cancel-button="true"
      confirm-text="确定取消"
      cancel-text="取消"
      @confirm="confirmCancel"
      @cancel="showCancel = false"
    />

    <u-popup :show="showReview" mode="bottom" round="20" @close="showReview = false">
      <view class="review-popup">
        <text class="review-title">评价课程</text>
        <u-rate v-model="reviewRating" active-color="#FFB800" />
        <u-textarea v-model="reviewContent" placeholder="写下您的课程评价..." />
        <u-button type="primary" text="提交评价" @click="submitReview" />
      </view>
    </u-popup>
    <float-tabbar :current="2" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getBookingList, cancelBooking, reviewBooking } from '../../services/booking';
import { useUserStore } from '../../store/user';
import { hideNativeTabBar } from '../../utils/tabbar';
import FloatTabbar from '../../components/float-tabbar/float-tabbar.vue';
import BookingCard from '../../components/booking-card/booking-card.vue';
import EmptyState from '../../components/empty-state/empty-state.vue';

const userStore = useUserStore();
const currentTab = ref(0);
const bookings = ref([]);
const loading = ref(true);
const showCancel = ref(false);
const showReview = ref(false);
const cancelTarget = ref(null);
const reviewTarget = ref(null);
const reviewRating = ref(5);
const reviewContent = ref('');

const statusMap = ['BOOKED', 'COMPLETED', 'CANCELLED'];
const tabs = ref([
  { name: '待上课' },
  { name: '已完成' },
  { name: '已取消' },
]);

const emptyText = computed(() => {
  const texts = ['暂无待上课预约', '暂无已完成课程', '暂无已取消预约'];
  return texts[currentTab.value];
});

onMounted(() => {
  loadBookings();
  hideNativeTabBar();
});
onShow(() => {
  hideNativeTabBar();
  loadBookings();
  userStore.refreshBookingCount();
});

async function loadBookings() {
  loading.value = true;
  try {
    const status = statusMap[currentTab.value];
    bookings.value = await getBookingList(status);
    const booked = await getBookingList('BOOKED');
    tabs.value[0].name = `待上课(${booked.length})`;
  } finally {
    loading.value = false;
  }
}

function onTabChange(e) {
  currentTab.value = e.index;
  loadBookings();
}

function onCancel(booking) {
  cancelTarget.value = booking;
  showCancel.value = true;
}

async function confirmCancel() {
  showCancel.value = false;
  try {
    await cancelBooking(cancelTarget.value.id);
    uni.showToast({ title: '预约已取消', icon: 'success' });
    loadBookings();
    userStore.refreshBookingCount();
  } catch (e) {
    console.error(e);
  }
}

function onReview(booking) {
  reviewTarget.value = booking;
  reviewRating.value = 5;
  reviewContent.value = '';
  showReview.value = true;
}

async function submitReview() {
  try {
    await reviewBooking(reviewTarget.value.id, {
      rating: reviewRating.value,
      content: reviewContent.value,
    });
    showReview.value = false;
    uni.showToast({ title: '评价成功', icon: 'success' });
  } catch (e) {
    console.error(e);
  }
}

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
  height: calc(100vh - 100rpx);
  padding: 24rpx;
  box-sizing: border-box;
}
.loading {
  display: flex;
  justify-content: center;
  padding: 80rpx;
}
.review-popup {
  padding: 40rpx;
}
.review-title {
  font-size: 32rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 24rpx;
  text-align: center;
}
</style>
