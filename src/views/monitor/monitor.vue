<script>
import { AutoOrder, NewArrival } from './tabs';

const name = 'monitor';
const TABS = {
  AUTO_ORDER: {
    name: 'Auto Order',
    key: 'AUTO_ORDER',
  },
  NEW_ARRIVAL: {
    name: 'New Arrival',
    key: 'NEW_ARRIVAL',
  },
};

export default {
  name,
  data() {
    return {
      currentTab: TABS.AUTO_ORDER.key,
    };
  },
  render() {
    return (
      <full-height-tabs v-model={this.currentTab} class={name}>
        <full-height-tab-pane key={TABS.AUTO_ORDER.key} title={TABS.AUTO_ORDER.name}>
          <AutoOrder />
        </full-height-tab-pane>
        <full-height-tab-pane key={TABS.NEW_ARRIVAL.key} title={TABS.NEW_ARRIVAL.name}>
          <NewArrival />
        </full-height-tab-pane>
      </full-height-tabs>
    );
  },
};
</script>
