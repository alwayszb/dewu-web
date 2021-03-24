<style lang="less" scoped>
// @import '';
</style>

<script>
import FullHeightTabPane from './pane';

const name = 'full-height-tabs';

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
  },
  data() {
    return {
      currentTab: '',
    };
  },
  computed: {
    tabList() {
      return this.getChildNodes().map(({ componentOptions, key }) => ({
        key,
        tab: componentOptions.propsData.title,
      }));
    },
  },
  watch: {
    activeKey: {
      handler(val) {
        this.currentTab = val;
      },
      immediate: true,
    },
  },
  methods: {
    getChildNodes() {
      return this.$slots.default.filter(
        (child) => child.componentOptions && child.componentOptions.tag === FullHeightTabPane.name,
      );
    },
  },
  render() {
    return (
      <full-height-container>
        <full-height-item headerBottom={false}>
          <template slot="fixed-header">
            <tab-menu
              activeKey={this.currentTab || ''}
              tabList={this.tabList}
              onChange={({ item, key, selectedKeys }) => {
                this.currentTab = key;
                this.$emit('input', key);
                this.$emit('change', { item, key, selectedKeys });
              }}
            />
          </template>

          <keep-alive>
            {this.getChildNodes().find((vnode) => vnode.key === this.currentTab)}
          </keep-alive>
        </full-height-item>
      </full-height-container>
    );
  },
};
</script>
