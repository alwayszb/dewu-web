<script>
import { productSizeApi } from '@/api';
const name = 'stock-form';

export default {
  name,

  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  data() {
    this.name = name;

    return {
      sizeList: [],
      stocks: {},
      sizeLoading: false,
    };
  },

  methods: {
    loadSizeList() {
      this.sizeLoading = true;
      productSizeApi
        .findSizesByArticleNumber(this.product.articleNumber)
        .then(({ data }) => {
          this.sizeList = data;
          this.stocks = {};
          this.sizeList.forEach(({ id }) => {
            this.$set(this.stocks, id, 0);
          });
        })
        .finally(() => (this.sizeLoading = false));
    },

    renderSizeInput({ id, size }) {
      return (
        <div style={{ display: 'inline-block', padding: '0.25rem 0.375rem' }}>
          <span
            style={{
              display: 'inline-block',
              marginRight: '0.25rem',
              width: '2rem',
              textAlign: 'right',
              color: '#999',
            }}
          >
            {size}
          </span>
          <a-input-number v-model={this.stocks[id]} min={0} style={{ width: '3.5rem' }} />
        </div>
      );
    },

    exportStocks() {
      return this.stocks;
    },
  },

  watch: {
    'product.articleNumber': {
      immediate: true,
      handler() {
        this.loadSizeList();
      },
    },
  },

  render() {
    return (
      <a-spin spinning={this.sizeLoading}>
        <div>{this.sizeList.map((size) => this.renderSizeInput(size))}</div>
      </a-spin>
    );
  },
};
</script>
