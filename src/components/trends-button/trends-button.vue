<script>
const name = 'trends-button';

export default {
  name,
  props: {
    btnProps: {
      type: Object,
      default: () => ({}),
    },
    articleNumber: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$info({
        icon: null,
        title: () => {
          return <div>123</div>;
        },
        content: () => {
          return <div>456</div>;
        },
      });
    },
  },
  render() {
    return (
      <a-button
        class={name}
        size="small"
        icon="stock"
        {...{ attrs: this.btnProps }}
        onClick={this.onClick}
      >
        {this.$slots.default}
      </a-button>
    );
  },
};
</script>
