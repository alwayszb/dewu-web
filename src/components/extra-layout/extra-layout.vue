<style lang="less" scoped>
@import './extra-layout.less';
</style>

<template>
  <div :class="classes">
    <div :class="`${rayName}-main`" :style="mainStyles">
      <slot />
    </div>
    <div :class="`${rayName}-extra`" :style="extraStyles">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
const rayName = 'extra-layout';

export default {
  name: rayName,
  props: {
    align: {
      type: String,
      validator(val) {
        return ['baseline', 'center', 'start', 'end'].includes(val);
      },
      default: 'center',
    },
    mainStyles: {
      type: Object,
      default: () => ({}),
    },
    extraStyles: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rayName,
    };
  },
  computed: {
    classes() {
      return [rayName, `${rayName}--align-${this.align}`];
    },
  },
};
</script>
