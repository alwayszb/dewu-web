<script>
import { ProductCard } from '@/components';

const name = 'search-list';

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
    onStar() {},
    onCancelStar() {},
    onViewTrends(product) {
      this.$emit('viewTrends', product);
    },
    onSyncPurchaseRecords(product) {
      this.$emit('sync', product);
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
              onSync={this.onSyncPurchaseRecords}
            />
          </Cell>
        ))}
      </Row>
    );
  },
};
</script>
