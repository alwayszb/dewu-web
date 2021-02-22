import Vue from 'vue';
import VCharts from 'v-charts';
import Antv from 'ant-design-vue';
import Clipboard from 'v-clipboard';
import vViewer from 'v-viewer';
import VueLazyload from 'vue-lazyload';
import VTooltip from 'v-tooltip';
import components from '@/components';
import App from './App.vue';
import router from './router';
import store from './store';

import './styles/global.less';

Vue.config.productionTip = false;

Vue.use(VCharts);
Vue.use(Antv);
Vue.use(Clipboard);
Vue.use(vViewer);
Vue.use(VueLazyload, {
  error: require('./assets/images/image-break.png'),
  loading: require('./assets/images/loading.jpg'),
});
Vue.use(VTooltip);
Vue.use(components);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
