import Vue from 'vue';
import VCharts from 'v-charts';
import HeyUI from 'heyui';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';
import Antv from 'ant-design-vue';
import Clipboard from 'v-clipboard';
import 'ant-design-vue/dist/antd.css';
import components from '@/components';
import App from './App.vue';
import router from './router';
import store from './store';

import './styles/global.less';

Vue.config.productionTip = false;

Vue.use(VCharts);
Vue.use(HeyUI);
Vue.use(Antv);
Vue.use(Clipboard);
Vue.use(components);
Vue.component('v-icon', Icon);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
