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
    renderProductInfo(product) {
      return (
        <div style={{ textAlign: 'center' }}>
          <img v-lazy={product.image} alt={product.name} height="60" width="auto" />
          <div style={{ marginTop: '0.125rem', color: '#999', fontSize: '80%' }}>
            {product.sellDate}
          </div>
        </div>
      );
    },
  },
  render() {
    const scopedSlots = {
      dateCellRender: (moment) => {
        const date = moment.format('YYYY.MM.DD');
        const product = this.releaseProducts.find(({ sellDate }) => sellDate === date);
        return product ? this.renderProductInfo(product) : null;
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
