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
    renderCloseIcon(onClose) {
      return <i class={['h-icon-close', `${name}-close`]} onClick={onClose} />;
    },
    renderTag(search, index) {
      const { value: searchValue } = search;
      return (
        <span
          class={['h-tag', `${name}-tag`]}
          key={search.value}
          onClick={() => this.onSearch(search, index)}
        >
          {searchValue}
          {this.renderCloseIcon((e) => {
            e.stopPropagation();
            this.onClose(search, index);
          })}
        </span>
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
      <Row class={name} type="flex" justify="center">
        <Cell width={8}>
          {this.data.map((search, index) => this.renderTag(search, index))}
          {this.data.length > 3 && (
            <i
              class={['h-icon-trash', `${name}-clear-all`]}
              v-tooltip
              content="Clear all"
              onClick={this.onClearAll}
            />
          )}
        </Cell>
      </Row>
    );
  },
};
</script>
