<style lang="less" scoped>
.ant-radio-button-wrapper {
  height: auto;
}
</style>

<script>
import { Trends } from '@/components';
import { sellSnapshotApi } from '@/api';

const name = 'trends-modal';

export default {
  name,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    productSizes() {
      return this.product.productSizes;
    },
  },
  data() {
    this.name = name;

    return {
      visible: false,
      size: null,
      sellSnapshotList: [],
    };
  },
  methods: {
    onClose() {
      this.size = null;
      this.$emit('input', false);
    },
    onOpen() {
      this.loadRealTimePriceData();
    },
    onSyncClick() {
      this.$emit('sync', this.product);
    },
    getRealTimePrice(skuId) {
      const sellSnapshot = this.sellSnapshotList.find((item) => skuId === item.skuId);
      return sellSnapshot && sellSnapshot.sellItem ? sellSnapshot.sellItem.price / 100 : null;
    },
    async loadRealTimePriceData() {
      this.sellSnapshotList = await sellSnapshotApi
        .getSellSnapshotBySpuId(this.product.spuId)
        .then(({ data }) => data);
    },
  },
  watch: {
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
  render() {
    return (
      <Modal v-model={this.visible} class={name} hasDivider>
        <div slot="header" class="text-ellipsis" v-width={800}>
          [ {this.product.articleNumber} ] {this.product.name}
        </div>
        <Button noBorder size="s" style={{ position: 'absolute' }} onClick={this.onSyncClick}>
          <v-icon name="spider" />
        </Button>
        {this.productSizes && (
          <a-radio-group
            v-model={this.size}
            size="small"
            button-style="solid"
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}
          >
            {this.productSizes.map(({ size, skuId }) => (
              <a-radio-button value={size}>
                <div style={{ textAlign: 'center' }}>
                  <div>{size}</div>
                  <div style={{ color: '#ccc', fontSize: '90%', borderTop: '1px solid #f5f5f5' }}>
                    {this.getRealTimePrice(skuId) || '-'}
                  </div>
                </div>
              </a-radio-button>
            ))}
          </a-radio-group>
        )}
        <Trends articleNumber={this.product.articleNumber} size={this.size} />
        <div slot="footer">
          <Button onClick={this.onClose}>Close</Button>
        </div>
      </Modal>
    );
  },
};
</script>
