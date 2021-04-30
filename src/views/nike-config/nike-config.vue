<script>
import { tabRouterMixin } from '@/mixins';
import { NikeAccount, NikeOrder } from './tabs';

const name = 'nike-config';
const TABS = {
  NIKE_ACCOUNT: {
    name: 'NIKE ACCOUNT',
    key: 'NIKE_ACCOUNT',
  },
  NIKE_ORDER: {
    name: 'NIKE ORDER',
    key: 'NIKE_ORDER',
  },
};

export default {
  name,

  mixins: [tabRouterMixin],

  data() {
    this.TABS = TABS;

    return {};
  },

  render() {
    return (
      <full-height-tabs
        v-model={this.currentTab}
        class={name}
        onChange={({ key }) => this.onTabChange(key)}
      >
        <full-height-tab-pane key={TABS.NIKE_ACCOUNT.key} title={TABS.NIKE_ACCOUNT.name}>
          <NikeAccount />
        </full-height-tab-pane>
        <full-height-tab-pane key={TABS.NIKE_ORDER.key} title={TABS.NIKE_ORDER.name}>
          <NikeOrder />
        </full-height-tab-pane>
      </full-height-tabs>
    );
  },
};
</script>
