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
    this.name = name;

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
            placeholder="Article Number, Title and SPU ID supported"
            onSearch={this.onSearch}
          />
        </a-col>
      </a-row>
    );
  },
};
</script>
