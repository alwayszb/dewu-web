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
    };
  },
  methods: {
    onStar() {},
    onCancelStar() {},
    onViewTrends(product) {
      this.actionProduct = product;
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

        <Modal v-model={this.trendsModalVisible}>
          <div slot="header" class="text-ellipsis" v-width={800}>
            {this.actionProduct.name}
          </div>
          <Trends articleNumber={this.actionProduct.articleNumber} size="42.5" />
        </Modal>
      </Row>
    );
  },
};
</script>
