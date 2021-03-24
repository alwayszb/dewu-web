<style lang="less" scoped>
@import './tab-menu.less';
</style>

<template>
  <a-menu
    v-if="tabList && tabList.length > 0"
    :class="classes"
    :mode="mode"
    :theme="theme"
    :selected-keys="[activeKey]"
    @select="onMenuSelect"
  >
    <a-menu-item v-for="(tab, index) in tabList" :key="tab.key" :disabled="tab.disabled">
      <a-badge :count="tab.count" v-bind="badge" :offset="[10, 0]">
        <a-icon v-if="tab.icon" :type="tab.icon" />
        <span>{{ tab.tab }}</span>
        <a-icon
          v-if="ifShowCloseBtn(tab)"
          :class="`${name}-close`"
          type="close"
          @click="
            (e) => {
              e.stopPropagation();
              onMenuClose(tab, index);
            }
          "
        />
      </a-badge>
    </a-menu-item>
  </a-menu>
</template>

<script>
const name = 'tab-menu';

const themes = {
  dark: 'dark',
  light: 'light',
};

export default {
  name,
  model: {
    prop: 'activeKey',
    event: 'input',
  },
  props: {
    /**
     * 主题
     * @values dark, light(default)
     */
    theme: {
      type: String,
      default: themes.light,
      validator(val) {
        return Object.values(themes).includes(val);
      },
    },
    /**
     * 标签列表, 包含 key 和 tab 属性, 额外属性: icon / count
     */
    tabList: {
      type: Array,
      required: true,
      validator(val) {
        return val && val.every((tab) => tab.key && tab.tab);
      },
    },
    /**
     * (v-model) 激活的标签
     */
    activeKey: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].includes(val);
      },
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: Object,
      default: () => ({}),
    },
    closable: {
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
    classes() {
      return [name, this.noBorder && `${name}--no-border`];
    },
  },
  methods: {
    onMenuSelect({ item, key, selectedKeys }) {
      this.$emit('input', key);
      this.$emit('change', { item, key, selectedKeys });
    },
    onMenuClose(tab, index) {
      this.$emit('close', tab, index);
    },
    ifShowCloseBtn(tab) {
      if (tab.closable === false) {
        return false;
      }
      return tab.closable || this.closable;
    },
  },
};
</script>
