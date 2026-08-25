<script setup>
import { onLaunch } from '@dcloudio/uni-app';
import { useAuthStore } from './store/auth';
import { useUserStore } from './store/user';

const authStore = useAuthStore();
const userStore = useUserStore();

onLaunch(async () => {
  await authStore.login();
  userStore.fetchUserInfo();
});
</script>

<style lang="scss">
@import 'uview-plus/index.scss';

page {
  background-color: #f6f8fb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #1f2937;
  font-size: 28rpx;
  --tabbar-spacer: calc(180rpx + env(safe-area-inset-bottom));
  --tabbar-spacer-fallback: calc(180rpx + constant(safe-area-inset-bottom));
}

.tabbar-spacer {
  height: var(--tabbar-spacer);
  height: var(--tabbar-spacer-fallback);
  flex-shrink: 0;
}

.tabbar-padding {
  padding-bottom: var(--tabbar-spacer) !important;
  padding-bottom: var(--tabbar-spacer-fallback) !important;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  box-sizing: border-box;
}

.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
