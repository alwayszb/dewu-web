<style lang="less" scoped>
.ant-radio-button-wrapper {
  height: auto;
}
</style>

<script>
import { productSizeApi, sellSnapshotApi } from '@/api';
const name = 'trends-modal';

export default {
  name,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    articleNumber: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
      productSizes: [],
      sellSnapshots: [],
      selectedSize: null,
    };
  },
  watch: {
    size: {
      immediate: true,
      handler(val) {
        this.selectedSize = val;
      },
    },
    value: {
      immediate: true,
      handler(val) {
        this.visible = val;
        if (val) {
          this.onOpen();
        }
      },
    },
    visible(val) {
      if (!val && this.value) {
        this.onClose();
      }
    },
  },
  methods: {
    loadProductSizes() {
      productSizeApi.findSizesByArticleNumber(this.articleNumber).then(({ data }) => {
        this.productSizes = data;
      });
    },
    loadSellSnapshots() {
      sellSnapshotApi.getSellSnapshotByArticleNumber(this.articleNumber).then(({ data }) => {
        this.sellSnapshots = data;
      });
    },
    onOpen() {
      this.selectedSize = this.size;
      this.loadProductSizes();
      this.loadSellSnapshots();
      this.$emit('input', true);
    },
    onClose() {
      this.selectedSize = null;
      this.productSizes = [];
      this.sellSnapshots = [];
      this.$emit('input', false);
    },
    getPriceBySkuId(skuId) {
      const sellSnapshot = this.sellSnapshots.find((item) => skuId === item.skuId);
      return sellSnapshot && sellSnapshot.sellItem ? sellSnapshot.sellItem.price / 100 : null;
    },
    renderModalTitle() {
      return (
        <div slot="title">
          [ {this.articleNumber} ] {this.productName}
        </div>
      );
    },
    renderSizeOptions() {
      return (
        <a-radio-group
          v-model={this.selectedSize}
          size="small"
          button-style="solid"
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}
        >
          {this.productSizes.map(({ size, skuId }) => (
            <a-radio-button value={size}>
              <div style={{ textAlign: 'center' }}>
                <div>{size}</div>
                <div style={{ color: '#ccc', fontSize: '90%', borderTop: '1px solid #f5f5f5' }}>
                  {this.getPriceBySkuId(skuId) || '-'}
                </div>
              </div>
            </a-radio-button>
          ))}
        </a-radio-group>
      );
    },
    renderTrends() {
      return <trends articleNumber={this.articleNumber} size={this.selectedSize} />;
    },
    renderFooter() {
      return (
        <div slot="footer">
          <a-button onClick={this.onClose}>Close</a-button>
        </div>
      );
    },
  },
  render() {
    return (
      <a-modal v-model={this.visible} width="80%" centered hasDivider destroyOnClose>
        {this.renderModalTitle()}
        {this.renderSizeOptions()}
        {this.renderTrends()}
        {this.renderFooter()}
      </a-modal>
    );
  },
};
</script>
