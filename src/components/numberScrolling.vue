<template>
  <div>
    {{ d.num.toFixed(2) }}
  </div>
</template>

<script setup>
import gsap from "gsap";
import { reactive, watch } from "vue";
//拿到从父组件传过来的值
const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});
const d = reactive({
  num: 0,
});

function AnimateToValue() {
  gsap.to(d, {
    duration: 0.5,
    num: props.value,
  });
}
AnimateToValue();
//监听props的value值是否发生变化，如果发生变化重新执行AnimateToValue()
watch(
  () => props.value,
  () => AnimateToValue()
);
</script>

<style scoped></style>
