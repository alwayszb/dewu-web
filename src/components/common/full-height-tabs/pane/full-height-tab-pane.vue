<script>
const name = 'full-height-tab-pane';

export default {
  name,
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  render() {
    return <div class={name}>{this.$slots.default}</div>;
  },
};
</script>
