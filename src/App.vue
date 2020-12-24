<template>
  <Layout id="app">
    <HHeader theme="dark" :style="{ height: '44px' }">
      <Menu ref="menu" :datas="menuDatas" mode="horizontal" @select="onMenuSelect" />
    </HHeader>
    <Content :style="{ overflow: 'auto' }">
      <keep-alive>
        <router-view class="animate__animated animate__fadeIn" />
      </keep-alive>
    </Content>
  </Layout>
</template>

<script>
export default {
  name: 'app',
  data() {
    this.menuDatas = [
      { title: 'Home', key: 'home', icon: 'h-icon-home' },
      { title: 'Search', key: 'search', icon: 'h-icon-search' },
      { title: 'Collect', key: 'collect', icon: 'h-icon-star-on' },
      { title: 'Task', key: 'task', icon: 'h-icon-task' },
      { title: 'Notice', key: 'notice', icon: 'h-icon-message' },
      { title: 'Calendar', key: 'calendar', icon: 'h-icon-calendar' },
    ];

    return {
      siderCollapsed: false,
    };
  },
  mounted() {
    this.triggerSelectMenu();
  },
  methods: {
    triggerSelectMenu() {
      if (this.$route.name) {
        this.$refs.menu.select(this.$route.name);
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
