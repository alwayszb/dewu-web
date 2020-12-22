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
    onKeypress({ keyCode }) {
      if (keyCode === 13 && this.data.value) {
        this.onSearch();
      }
    },
    onSearch() {
      this.$emit('search', this.data);
    },
  },
  render() {
    return (
      <Row type="flex" justify="center" style={{ margin: '4rem 0 0.5rem' }}>
        <Cell width={8}>
          <div class="h-input-group" style={{ width: '100%' }}>
            <input
              v-model={this.data.value}
              type="text"
              placeholder="Article Number, Title and SPU ID supported"
              onKeypress={this.onKeypress}
            />
            <Button color="primary" hover icon="h-icon-search" onClick={this.onSearch} />
          </div>
        </Cell>
      </Row>
    );
  },
};
</script>
