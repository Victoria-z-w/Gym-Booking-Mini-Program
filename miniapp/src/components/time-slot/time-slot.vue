<template>
  <view
    class="time-slot"
    :class="{ selected, disabled }"
    @click="handleClick"
  >
    <view class="time">{{ slot.startTime }} - {{ slot.endTime }}</view>
    <view class="remain">剩余 {{ remaining }} / {{ slot.capacity }}</view>
    <view class="status" :style="{ color: statusInfo.color }">{{ statusInfo.label }}</view>
    <u-icon v-if="selected" name="checkmark" color="#2878FF" size="20" class="check" />
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { getSlotStatus } from '../../utils/constants';

const props = defineProps({
  slot: { type: Object, required: true },
  selected: { type: Boolean, default: false },
});

const emit = defineEmits(['select']);

const remaining = computed(() => props.slot.capacity - props.slot.bookedCount);
const disabled = computed(() => remaining.value <= 0 || props.slot.status === 'FULL');
const statusInfo = computed(() => getSlotStatus(remaining.value, props.slot.capacity));

function handleClick() {
  if (disabled.value) return;
  emit('select', props.slot);
}
</script>

<style lang="scss" scoped>
.time-slot {
  background: #fff;
  border: 2rpx solid #e8ecf0;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  margin-bottom: 20rpx;
  position: relative;
  transition: all 0.2s;
}
.time-slot.selected {
  border-color: #2878ff;
  background: #f0f6ff;
}
.time-slot.disabled {
  opacity: 0.5;
  background: #f5f5f5;
}
.time {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
}
.remain {
  font-size: 24rpx;
  color: #8a94a6;
  margin-top: 8rpx;
}
.status {
  font-size: 24rpx;
  margin-top: 4rpx;
  font-weight: 500;
}
.check {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
}
</style>
