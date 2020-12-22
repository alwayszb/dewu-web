<style lang="less" scoped>
//
</style>

<template>
  <div :class="name">Welcome</div>
</template>

<script>
const name = 'Home';

export default {
  name,
  components: {},
  created() {},
  mounted() {},
  data() {
    this.name = name;
    return {};
  },
  methods: {},
  computed: {},
  watch: {},
};
</script>
