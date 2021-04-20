<script>
import { tabRouterMixin } from '@/mixins';
import { AutoOrder, NewArrival, AppAccount } from './tabs';

const name = 'monitor';
const TABS = {
  AUTO_ORDER: {
    name: 'AUTO ORDER',
    key: 'AUTO_ORDER',
  },
  NEW_ARRIVAL: {
    name: 'NEW ARRIVAL',
    key: 'NEW_ARRIVAL',
  },
  APP_ACCOUNT: {
    name: 'APP ACCOUNT',
    key: 'APP_ACCOUNT',
  },
};

export default {
  name,

  mixins: [tabRouterMixin],

  data() {
    this.TABS = TABS;

    return {};
  },

  created() {},

  render() {
    return (
      <full-height-tabs
        v-model={this.currentTab}
        class={name}
        onChange={({ key }) => this.onTabChange(key)}
      >
        <full-height-tab-pane key={TABS.AUTO_ORDER.key} title={TABS.AUTO_ORDER.name}>
          <AutoOrder />
        </full-height-tab-pane>
        <full-height-tab-pane key={TABS.NEW_ARRIVAL.key} title={TABS.NEW_ARRIVAL.name}>
          <NewArrival />
        </full-height-tab-pane>
        <full-height-tab-pane key={TABS.APP_ACCOUNT.key} title={TABS.APP_ACCOUNT.name}>
          <AppAccount />
        </full-height-tab-pane>
      </full-height-tabs>
    );
  },
};
</script>
