<style lang="less" scoped>
@import './full-height-item.less';
</style>

<template>
  <a-col :span="span">
    <div :class="name" :style="{ borderRightWidth: hideRightBorder || span === 24 ? 0 : '1px' }">
      <div :class="headerClasses">
        <slot name="fixed-header" />
      </div>
      <div :class="`${name}-content`" :style="contentStyles">
        <slot />
      </div>
      <div :class="footerClasses">
        <slot name="fixed-footer" />
      </div>
      <div v-if="overlay || $slots.overlay || loading" :class="`${name}-overlay`">
        <div :class="`${name}-overlay-background`" />
        <div :class="`${name}-overlay-main`" :style="overlayStyles">
          <a-spin v-if="loading" />
          <slot v-else name="overlay">{{ overlay }}</slot>
        </div>
      </div>
    </div>
  </a-col>
</template>

<script>
const name = 'full-height-item';

export default {
  name,
  props: {
    span: {
      type: Number,
      default: 24,
    },
    headerShadow: {
      type: Boolean,
      default: false,
    },
    headerBottom: {
      type: Boolean,
      default: true,
    },
    footerShadow: {
      type: Boolean,
      default: false,
    },
    overlay: {
      type: String,
      default: null,
    },
    hideRightBorder: {
      type: Boolean,
      default: false,
    },
    contentStyles: {
      type: Object,
      default: () => ({}),
    },
    overlayStyles: {
      type: Object,
      default: () => ({}),
    },
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
  computed: {
    headerClasses() {
      return [
        `${name}-header`,
        this.headerShadow && `${name}-header--shadow`,
        this.headerBottom && `${name}-header--bottom`,
      ];
    },
    footerClasses() {
      return [`${name}-footer`, this.footerShadow && `${name}-footer--shadow`];
    },
  },
};
</script>
