<script>
import { ProductCard, Trends } from '@/components';

const name = 'search-list';

export default {
  name,
  components: {
    ProductCard,
    Trends,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.name = name;

    return {
      actionProduct: {},
      trendsModalVisible: false,
      selectedSize: null,
    };
  },
  methods: {
    onStar() {},
    onCancelStar() {},
    onViewTrends(product) {
      this.actionProduct = product;
      this.selectedSize = this.actionProduct.productSizes
        ? this.actionProduct.productSizes[0].size
        : null;
      this.trendsModalVisible = true;
    },
  },
  render() {
    return (
      <Row class={name} space={8}>
        {this.data.map((product) => (
          <Cell width={4} key={product.id}>
            <ProductCard
              data={product}
              onStar={this.onStar}
              onCancelStar={this.onCancelStar}
              onViewTrends={this.onViewTrends}
            />
          </Cell>
        ))}

        <Modal v-model={this.trendsModalVisible} hasDivider>
          <div slot="header" class="text-ellipsis" v-width={800}>
            {this.actionProduct.name}
          </div>
          {this.actionProduct.productSizes && (
            <SwitchList
              v-model={this.selectedSize}
              datas={this.actionProduct.productSizes.map(({ size }) => size)}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}
              small
            />
          )}
          <Trends articleNumber={this.actionProduct.articleNumber} size={this.selectedSize} />
          <div slot="footer">
            <Button onClick={() => (this.trendsModalVisible = false)}>Close</Button>
          </div>
        </Modal>
      </Row>
    );
  },
};
</script>
