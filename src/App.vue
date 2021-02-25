<template>
  <a-layout id="app">
    <a-layout-header
      v-if="hasAuthorized"
      :style="{ position: 'fixed', zIndex: 1, width: '100%', height: '3rem' }"
    >
      <a-menu
        v-model="selectedMenu"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '3rem' }"
        @select="onMenuSelect"
      >
        <a-menu-item v-for="option in menuOptions" :key="option.key">
          <a-icon :type="option.icon" />
          <span>{{ option.title }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ marginTop: '3rem', overflow: 'auto' }">
      <a-spin :spinning="isLoading">
        <keep-alive>
          <router-view class="animate__animated animate__fadeIn" />
        </keep-alive>
      </a-spin>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  data() {
    this.menuOptions = [
      { title: 'Home', key: 'home', icon: 'home' },
      { title: 'Stock', key: 'stock', icon: 'appstore' },
      { title: 'Search', key: 'search', icon: 'search' },
      { title: 'Favorite', key: 'favorite', icon: 'star' },
      { title: 'Task', key: 'task', icon: 'schedule' },
      { title: 'Calendar', key: 'calendar', icon: 'calendar' },
    ];

    return {
      selectedMenu: [],
    };
  },
  computed: {
    ...mapGetters(['isLoading']),
    hasAuthorized() {
      return !!localStorage.getItem('timestamp');
    },
  },
  mounted() {
    this.triggerSelectMenu();
  },
  methods: {
    triggerSelectMenu() {
      if (this.$route.name) {
        this.selectedMenu = [this.$route.name];
      }
    },
    onMenuSelect({ key: name }) {
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
  },
};
</script>
