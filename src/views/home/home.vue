<script>
import { productApi } from '@/api';
import { time } from '@/utils';

const name = 'home';

export default {
  name,
  data() {
    this.name = name;

    return {
      productList: [],
    };
  },
  created() {
    this.loadNewAddedProductList();
  },
  methods: {
    async loadNewAddedProductList() {
      this.productList = await productApi.findNewAddedProducts().then(({ data }) => data);
    },
  },
  render() {
    return (
      <div class={name}>
        <div style={{ padding: '0.75rem 0.5rem' }}>
          <Row space={8}>
            {this.productList.map((product) => (
              <Cell width={6} key={product.id}>
                <product-card data={product}>
                  <div slot="footer">{time.formatToTime(product.createdAt)}</div>
                </product-card>
              </Cell>
            ))}
          </Row>
        </div>
      </div>
    );
  },
};
</script>
