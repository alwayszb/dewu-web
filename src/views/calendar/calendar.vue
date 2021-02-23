<script>
import { productApi } from '@/api';
const name = 'calendar';

export default {
  name,
  data() {
    return {
      releaseProducts: [],
    };
  },
  created() {
    this.loadReleaseProducts();
  },
  methods: {
    loadReleaseProducts() {
      productApi.findProductsReleaseRecently().then(({ data }) => {
        this.releaseProducts = data;
      });
    },
    renderProductInfo(products) {
      const getItem = (product, height = 60) => {
        return (
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <img v-lazy={product.image} alt={product.name} height={height} />
            <div style={{ marginLeft: '0.125rem', fontSize: '80%' }}>
              <div style={{ color: '#666' }}>{product.articleNumber}</div>
              <div style={{ color: '#999' }}>{product.sellDate}</div>
            </div>
          </div>
        );
      };
      return products.map((product) => getItem(product));
    },
  },
  render() {
    const scopedSlots = {
      dateCellRender: (moment) => {
        const date = moment.format('YYYY.MM.DD');
        const products = this.releaseProducts.filter(({ sellDate }) => sellDate === date);
        return products.length > 0 ? (
          <div>
            <div style={{ color: '#666', fontSize: '80%' }}>Total: {products.length}</div>
            {this.renderProductInfo(products)}
          </div>
        ) : null;
      },
    };

    return (
      <div class={name}>
        <a-calendar {...{ scopedSlots }} />
      </div>
    );
  },
};
</script>
