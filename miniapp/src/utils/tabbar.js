export const TABBAR_SPACER = 'calc(128rpx + env(safe-area-inset-bottom))';

export function hideNativeTabBar() {
  uni.hideTabBar({ animation: false, fail: () => {} });
}
