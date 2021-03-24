<script>
import { autoOrderApi } from '@/api';
import { lodash } from '@/utils';

const name = 'auto-order';

export default {
  name,
  data() {
    this.columns = [
      {
        dataIndex: 'product.image',
        title: 'Product',
        width: 100,
        customRender: (value, record) => {
          return (
            <img
              v-lazy={value}
              alt={record.product.name}
              style={{ height: '53.75px', width: '84px' }}
            />
          );
        },
      },
      {
        dataIndex: 'product.name',
        title: 'Name',
      },
      {
        dataIndex: 'productSize.size',
        title: 'Size',
        width: 100,
      },
      {
        dataIndex: 'product.articleNumber',
        title: 'Article Number',
        width: 140,
        customRender: (value) => {
          return (
            <div>
              <span>{value}</span>
              <a-button
                type="link"
                size="small"
                icon="copy"
                onClick={() => {
                  if (this.$clipboard(value)) {
                    this.$message.success('copy success');
                  } else {
                    this.$message.error('copy failed');
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        title: 'Lock Price',
        width: 100,
        customRender: (value, record, index) => {
          return (
            <inline-edit
              value={record.lockPrice}
              onBlur={(lockPrice) => {
                this.onLockPriceChange(record, lockPrice, index);
              }}
            >
              <div slot="suffix">{record.ordered && <a-icon type="lock" />}</div>
            </inline-edit>
          );
        },
      },
      {
        title: 'Enable Auto Order',
        width: 140,
        customRender: (value, record) => {
          return (
            <a-switch v-model={record.enabled} onChange={() => this.onEnabledChange(record)} />
          );
        },
      },
      {
        title: 'Actions',
        width: 140,
        customRender: (value, record, index) => {
          return (
            <div>
              <a-button
                size="small"
                icon="stock"
                v-tooltip="View Trends"
                onClick={() => this.onViewTrends(record, index)}
              />
              <a-popconfirm
                title="Confirm to delete?"
                onConfirm={() => this.onDeleteClick(record.id, index)}
              >
                <a-button type="danger" size="small" icon="delete" />
              </a-popconfirm>
            </div>
          );
        },
      },
    ];

    return {
      dataSource: [],
      actionRecord: {},
      selectModalVisible: false,
      trendsModalVisible: false,
    };
  },
  created() {
    this.loadTableData();
  },
  methods: {
    loadTableData() {
      autoOrderApi.findAllAutoOrders({}).then(({ data }) => {
        this.dataSource = data;
      });
    },
    onAddRecord() {
      this.selectModalVisible = true;
    },
    onAddProductSuccess(data) {
      this.dataSource.push(...data);
    },
    onLockPriceChange(record, price) {
      if (record.lockPrice === Number(price)) {
        return;
      }
      const lockPrice = price ? Number(price) : 0;
      autoOrderApi.updateAutoOrder(record.id, { ...record, lockPrice }).then(() => {
        this.loadTableData();
      });
    },
    onEnabledChange(record) {
      autoOrderApi.updateAutoOrder(record.id, record).then(() => {
        this.loadTableData();
      });
    },
    onViewTrends(record) {
      this.actionRecord = record;
      this.trendsModalVisible = true;
    },
    onDeleteClick(id) {
      autoOrderApi.deleteAutoOrder(id).then(() => {
        this.loadTableData();
      });
    },
  },
  render() {
    return (
      <div>
        <du-table dataSource={this.dataSource} columns={this.columns} rowKey="id" full-height>
          <template slot="condition">
            <a-input-search placeholder="search" style={{ width: '14rem' }} />
            <a-button
              type="primary"
              icon="file-add"
              style={{ margin: '0 0.5rem' }}
              onClick={this.onAddRecord}
            >
              ADD RECORD
            </a-button>
          </template>
        </du-table>

        <product-select
          v-model={this.selectModalVisible}
          submit={(autoOrder) => {
            return autoOrderApi
              .createAutoOrder(autoOrder, { contentLoading: false })
              .then(({ data }) => data);
          }}
          onSuccess={this.onAddProductSuccess}
        />

        {!lodash.isEmpty(this.actionRecord) && (
          <trends-modal
            v-model={this.trendsModalVisible}
            articleNumber={this.actionRecord.product.articleNumber}
            productName={this.actionRecord.product.name}
            size={this.actionRecord.productSize.size}
          />
        )}
      </div>
    );
  },
};
</script>
