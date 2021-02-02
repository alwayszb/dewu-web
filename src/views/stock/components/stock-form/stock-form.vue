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
    };
  },

  methods: {
    loadSizeList() {
      productSizeApi.findSizesBySpuId(this.product.spuId).then(({ data }) => {
        this.sizeList = data;
        this.sizeList.forEach(({ id }) => {
          this.$set(this.stocks, id, 0);
        });
      });
    },

    renderSizeInput({ id, size }) {
      return (
        <div style={{ display: 'inline-block', padding: '0.25rem 0.375rem' }}>
          <span
            style={{
              display: 'inline-block',
              marginRight: '0.25rem',
              width: '1.75rem',
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
    'product.spuId': {
      immediate: true,
      handler() {
        this.loadSizeList();
      },
    },
  },

  render() {
    return <div>{this.sizeList.map((size) => this.renderSizeInput(size))}</div>;
  },
};
</script>
