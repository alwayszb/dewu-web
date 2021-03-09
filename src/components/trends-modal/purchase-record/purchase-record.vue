<script>
import { purchaseRecordApi } from '@/api';
import { time } from '@/utils';

const name = 'purchase-record';

export default {
  name,
  props: {
    articleNumber: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
  },
  data() {
    this.columns = [
      { dataIndex: 'articleNumber', title: 'Article Number' },
      { dataIndex: 'purchaser', title: 'Purchaser' },
      { dataIndex: 'size', title: 'Size' },
      {
        dataIndex: 'price',
        title: 'Price',
        sorter: (rowA, rowB) => rowA.price - rowB.price,
        customRender: (value) => value / 100,
      },
      { dataIndex: 'orderSubTypeName', title: 'Type', customRender: (value) => value || '-' },
    ];
    return {
      tableLoading: false,
      dataSource: [],
    };
  },
  watch: {
    articleNumber: {
      immediate: true,
      handler() {
        this.loadPurchaseRecords();
      },
    },
    size() {
      this.loadPurchaseRecords();
    },
  },
  methods: {
    loadPurchaseRecords() {
      if (!this.size || !this.articleNumber) {
        return;
      }
      this.tableLoading = true;
      this.dataSource = [];
      purchaseRecordApi
        .findPurchaseRecordsByProduct({
          articleNumber: this.articleNumber,
          size: this.size,
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
      <div class={name}>
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
      </div>
    );
  },
};
</script>
