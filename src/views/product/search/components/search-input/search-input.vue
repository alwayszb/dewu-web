<script>
const name = 'search-input';

export default {
  name,
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    onSearch(value) {
      if (value) {
        this.$emit('search', this.data);
      }
    },
  },
  render() {
    return (
      <a-row type="flex" justify="center" style={{ margin: '2rem 0 0.5rem' }}>
        <a-col span={8}>
          <a-input-search
            v-model={this.data.value}
            allowClear
            placeholder="Article Number / Product Name"
            onSearch={this.onSearch}
          />
        </a-col>
      </a-row>
    );
  },
};
</script>
