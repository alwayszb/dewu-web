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
      showImage: localStorage.getItem('showImage') === 'true',
      selectedTab: TABS.IN_STOCK.key,
    };
  },

  methods: {},

  render() {
    const tabContent = {
      [TABS.IN_STOCK.key]: <InStock showImage={this.showImage} />,
      [TABS.SALES_RECORD.key]: <SalesRecord showImage={this.showImage} />,
    };

    return (
      <a-tabs class={name} v-model={this.selectedTab} animated={false}>
        {Object.values(TABS).map(({ key, name }) => (
          <a-tab-pane tab={name} key={key}>
            {tabContent[key]}
          </a-tab-pane>
        ))}
        <template slot="tabBarExtraContent">
          <a-switch
            v-model={this.showImage}
            style={{ margin: '0 0.5rem' }}
            onChange={(checked) => {
              localStorage.setItem('showImage', checked);
            }}
          >
            <template slot="checkedChildren">
              <span>IMAGE </span>
              <a-icon type="check" />
            </template>
            <template slot="unCheckedChildren">
              <span>IMAGE </span>
              <a-icon type="close" />
            </template>
          </a-switch>
        </template>
      </a-tabs>
    );
  },
};
</script>
