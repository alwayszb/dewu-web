export default {
  data() {
    return {
      currentTab: null,
    };
  },
  created() {
    this.currentTab = this.$route.query.tab || this.getFirstTabKey();
  },
  methods: {
    getFirstTabKey() {
      return Object.values(this.TABS)[0].key;
    },
    onTabChange(key) {
      this.$router.push({
        name: this.$route.name,
        query: { tab: key },
      });
    },
  },
};
