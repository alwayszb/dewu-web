import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingCount: 0,
  },
  mutations: {
    showLoading(state) {
      state.loadingCount += 1;
    },
    hideLoading(state) {
      if (state.loadingCount > 0) {
        state.loadingCount -= 1;
      }
    },
  },
  getters: {
    isLoading(state) {
      return state.loadingCount > 0;
    },
  },
  actions: {},
  modules: {},
});
