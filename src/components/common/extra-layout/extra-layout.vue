<style lang="less" scoped>
@import './extra-layout.less';
</style>

<template>
  <div :class="classes">
    <div :class="`${name}-main`" :style="mainStyles">
      <slot />
    </div>
    <div :class="`${name}-extra`" :style="extraStyles">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
const name = 'extra-layout';

export default {
  name,
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
      name,
    };
  },
  computed: {
    classes() {
      return [name, `${name}--align-${this.align}`];
    },
  },
};
</script>
