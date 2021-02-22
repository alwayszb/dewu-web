<style lang="less" scoped>
@name: icon-button;

.@{name} {
  padding: 0;

  &:hover {
    /deep/ i > svg {
      fill: @blue-4;
    }
  }
}
</style>

<script>
const name = 'icon-button';

export default {
  name,
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    type: {
      type: String,
      default: 'link',
    },
    tooltip: {
      type: String,
      default: '',
    },
    filled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
  render() {
    return (
      <a-button
        class={name}
        type={this.type}
        size={this.size}
        onClick={this.onClick}
        v-tooltip
        content={this.tooltip}
      >
        <a-icon type={this.icon} theme={this.filled ? 'filled' : 'outlined'} />
      </a-button>
    );
  },
};
</script>
