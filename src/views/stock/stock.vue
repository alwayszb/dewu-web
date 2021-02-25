<style lang="less" scoped>
// @import './stock.less';
</style>

<script>
import InStock from './tabs/in-stock';
import SalesRecord from './tabs/sales-record';

const name = 'stock';

const TABS = {
  IN_STOCK: {
    key: 'IN_STOCK',
    name: 'IN STOCK',
  },
  SALES_RECORD: {
    key: 'SALES_RECORD',
    name: 'SALES RECORD',
  },
};

export default {
  name,

  created() {},

  computed: {},

  data() {
    return {
      selectedTab: TABS.IN_STOCK.key,
    };
  },

  methods: {},

  render() {
    const tabContent = {
      [TABS.IN_STOCK.key]: <InStock />,
      [TABS.SALES_RECORD.key]: <SalesRecord />,
    };

    return (
      <a-tabs class={name} v-model={this.selectedTab} animated={false}>
        {Object.values(TABS).map(({ key, name }) => (
          <a-tab-pane tab={name} key={key}>
            {tabContent[key]}
          </a-tab-pane>
        ))}
      </a-tabs>
    );
  },
};
</script>
