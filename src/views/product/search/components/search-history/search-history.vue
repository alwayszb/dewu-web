<style lang="less">
@import './search-history.less';
</style>

<script>
const name = 'search-history';

export default {
  name,
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.name = name;

    return {};
  },
  methods: {
    renderTag(search, index) {
      const { value: searchValue } = search;
      return (
        <a-tag
          color="blue"
          key={search.value}
          closable
          style={{ cursor: 'pointer', marginBottom: '0.125rem' }}
          onClose={() => this.onClose(search, index)}
          onClick={() => this.onSearch(search, index)}
        >
          {searchValue}
        </a-tag>
      );
    },
    onSearch(search, index) {
      this.$emit('search', search, index);
    },
    onClose(search, index) {
      this.data.splice(index, 1);
      this.$emit('close', search, index);
    },
    onClearAll() {
      this.data.splice(0);
      this.$emit('clearAll');
    },
  },
  render() {
    return (
      <a-row class={name} type="flex" justify="center">
        <a-col span={8}>
          {this.data.map((search, index) => this.renderTag(search, index))}
          {this.data.length > 3 && (
            <a-icon
              type="delete"
              class={`${name}-clear-all`}
              v-tooltip="Clear All"
              onClick={this.onClearAll}
            />
          )}
        </a-col>
      </a-row>
    );
  },
};
</script>
