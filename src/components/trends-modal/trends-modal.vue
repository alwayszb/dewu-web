<style lang="less" scoped>
.ant-radio-button-wrapper {
  height: auto;
}
</style>

<script>
import { productSizeApi, purchaseRecordApi, sellSnapshotApi } from '@/api';
import { time } from '@/utils';

const name = 'trends-modal';
const TABS = {
  TRENDS: {
    name: 'Trends',
    key: 'TRENDS',
  },
  RECORDS: {
    name: 'Records',
    key: 'RECORDS',
  },
};

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
      columns: [
        { dataIndex: 'articleNumber', title: 'Article Number' },
        { dataIndex: 'purchaser', title: 'Purchaser' },
        { dataIndex: 'size', title: 'Size' },
        { dataIndex: 'price', title: 'Price', customRender: (value) => value / 100 },
        { dataIndex: 'orderSubTypeName', title: 'Type', customRender: (value) => value || '-' },
      ],
      dataSource: [],
      selectedTab: TABS.TRENDS.key,
      tableLoading: false,
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
          onChange={() => {
            if (this.selectedTab === TABS.RECORDS.key) {
              this.loadPurchaseRecords();
            }
          }}
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
      return (
        this.selectedTab === TABS.TRENDS.key && (
          <trends articleNumber={this.articleNumber} size={this.selectedSize} />
        )
      );
    },
    renderFooter() {
      return (
        <div slot="footer">
          <a-button onClick={this.onClose}>Close</a-button>
        </div>
      );
    },
    loadPurchaseRecords() {
      this.tableLoading = true;
      this.dataSource = [];
      purchaseRecordApi
        .findPurchaseRecordsByProduct({
          articleNumber: this.articleNumber,
          size: this.selectedSize,
          date: time.formatToDate(),
          overseas: true,
          demand: true,
        })
        .then(({ data }) => {
          this.dataSource = data;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
  },
  render() {
    return (
      <a-modal
        v-model={this.visible}
        width="100%"
        bodyStyle={{ padding: 0 }}
        dialogStyle={{ top: 0 }}
        hasDivider
        destroyOnClose
      >
        {this.renderModalTitle()}
        <a-tabs
          v-model={this.selectedTab}
          animated={false}
          onChange={(key) => {
            if (key === TABS.RECORDS.key && this.selectedSize) {
              this.loadPurchaseRecords();
            }
          }}
        >
          <a-tab-pane tab={TABS.TRENDS.name} key={TABS.TRENDS.key}>
            {this.renderSizeOptions()}
            {this.renderTrends()}
            {this.renderFooter()}
          </a-tab-pane>
          <a-tab-pane tab={TABS.RECORDS.name} key={TABS.RECORDS.key}>
            {this.renderSizeOptions()}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <a-tag>Total: {this.dataSource.length}</a-tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a-table
                dataSource={this.dataSource}
                columns={this.columns}
                rowKey="id"
                pagination={false}
                scroll={{ y: 500 }}
                loading={this.tableLoading}
                style={{ width: '68%' }}
              />
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    );
  },
};
</script>
