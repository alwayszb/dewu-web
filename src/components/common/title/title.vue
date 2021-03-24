<style lang="less" scoped>
@import './title.less';
</style>

<template>
  <div :class="name">
    <extra-layout>
      <div :class="`${name}-text`">
        <slot />
      </div>

      <slot slot="extra" name="extra" />
    </extra-layout>
  </div>
</template>

<script>
const name = 'du-title';

export default {
  name,
  data() {
    return {
      name,
    };
  },
};
</script>
