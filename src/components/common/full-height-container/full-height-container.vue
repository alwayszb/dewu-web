<style lang="less" scoped>
@import './full-height-container.less';
</style>

<template>
  <a-row :class="name" type="flex">
    <slot />

    <div v-if="loading" :class="`${name}-loading`">
      <a-spin spinning />
    </div>
  </a-row>
</template>

<script>
const name = 'full-height-container';

export default {
  name,
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name,
    };
  },
};
</script>
