<script>
import ProductResult from '../product-result';

const name = 'search-list';

export default {
  name,
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    span: {
      type: Number,
      default: 6,
    },
  },
  data() {
    this.name = name;

    return {};
  },
  methods: {
    onStar(product) {
      this.$emit('star', product);
    },
    onCancelStar(product) {
      this.$emit('cancelStar', product);
    },
    onViewTrends(product) {
      this.$emit('viewTrends', product);
    },
    onSyncPurchaseRecords(product) {
      this.$emit('sync', product);
    },
    onCaptureDetail(product) {
      this.$emit('captureDetail', product);
    },
  },
  render() {
    return (
      <a-row class={name} gutter={8}>
        {this.data.map((product) => (
          <a-col span={this.span} key={product.id}>
            <ProductResult
              data={product}
              onStar={this.onStar}
              onCancelStar={this.onCancelStar}
              onViewTrends={this.onViewTrends}
              onSync={this.onSyncPurchaseRecords}
              onCaptureDetail={this.onCaptureDetail}
              style={{ marginBottom: '0.5rem' }}
            />
          </a-col>
        ))}
      </a-row>
    );
  },
};
</script>
