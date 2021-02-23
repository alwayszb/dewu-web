<style lang="less" scoped>
@import './stock.less';
</style>

<script>
import { stockApi } from '@/api';
import { time, lodash } from '@/utils';
import AddStock from './components/add-stock';

const name = 'stock';

const getProfitInfo = (stock) => {
  const { stockPrice, snapshotPrice, serviceFeeRate } = stock;
  if (!stockPrice) {
    return {};
  }
  const techServiceFee = lodash.round(snapshotPrice * serviceFeeRate, 2);
  const transferFee = lodash.round(snapshotPrice * 0.01, 2);
  const serviceFee = lodash.round(techServiceFee + transferFee + 33, 2); // 打包费+鉴别费=33
  const salesRevenue = lodash.round(snapshotPrice - serviceFee, 2);
  const profit = lodash.round(salesRevenue - stockPrice, 2);
  const profitPercent = lodash.round((profit / stockPrice) * 100, 2);
  return {
    techServiceFee, // 技术服务费
    transferFee, // 转账手续费
    salesRevenue, // 毛利
    profit, // 利润
    profitPercent, // 利润百分比
  };
};

const normalize = (data) => {
  const { stockPrice, sellSnapshots, ...res } = data;
  const sellSnapshot = sellSnapshots && sellSnapshots.length > 0 ? sellSnapshots[0] : null;
  const snapshotInfo = {};
  if (sellSnapshot) {
    const { createdAt, price, tradeDesc } = sellSnapshot;
    Object.assign(snapshotInfo, {
      snapshotDate: createdAt,
      snapshotPrice: price / 100, // 售出价格
      tradeDesc,
    });
  }
  const stock = {
    ...res,
    editing: false,
    serviceFeeRate: 0.05,
    stockPrice,
    sellSnapshots,
    ...snapshotInfo,
  };
  const profitInfo = getProfitInfo(stock);
  Object.assign(stock, profitInfo);
  return stock;
};

export default {
  name,

  created() {
    this.loadStockList();
  },

  computed: {},

  data() {
    this.name = name;
    this.backupColumns = [
      {
        dataIndex: 'product.image',
        title: 'Product',
        width: 100,
        customRender: (value, record) => {
          return (
            <img
              v-lazy={value}
              alt={record.product.title}
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
        width: 60,
      },
      {
        dataIndex: 'product.articleNumber',
        title: 'Article Number',
        width: 130,
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
        dataIndex: 'stockPrice',
        title: 'Stock Price',
        width: 120,
        customRender: (value, record, index) => {
          return record.editing ? (
            <a-input-number
              ref={`stockPrice-${index}`}
              value={record.stockPrice}
              style={{ width: '6rem' }}
              onBlur={(e) => {
                const stockPrice = parseInt(e.target.value || 0, 10);
                this.updateStock(record, stockPrice, index);
              }}
              onPressEnter={() => {
                this.$refs[`stockPrice-${index}`].blur();
              }}
            />
          ) : (
            <span
              class="hover-edit"
              onClick={() => {
                record.editing = true;
                this.$nextTick(() => {
                  this.$refs[`stockPrice-${index}`].focus();
                });
              }}
            >
              {value}
            </span>
          );
        },
      },
      {
        title: 'Price Info',
        width: 240,
        customRender: (value, record) => {
          if (!record.stockPrice || record.sellSnapshots.length === 0) {
            return '-';
          }

          const {
            snapshotPrice,
            techServiceFee,
            transferFee,
            salesRevenue,
            profit,
            profitPercent,
            tradeDesc,
            snapshotDate,
          } = record;

          const valueDisplay = (
            <div>
              <div>
                <a-tag v-tooltip={time.formatToTime(snapshotDate)}>
                  {tradeDesc} | {snapshotPrice}
                </a-tag>
                <a-tag
                  v-tooltip={`${snapshotPrice} - ${techServiceFee} - ${transferFee} - 33 = ${salesRevenue}`}
                >
                  到手: {salesRevenue}
                </a-tag>
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                <a-tag color={this.getProfitTagColor(profit)}>
                  <span>利润: {profit}</span>
                </a-tag>
                <a-tag color={this.getProfitPercentTagColor(profitPercent)}>{profitPercent}%</a-tag>
              </div>
            </div>
          );
          return valueDisplay;
        },
      },
      {
        title: 'SFR',
        customRender: (value, record) => {
          return (
            <a-input-number
              value={record.serviceFeeRate}
              style={{ width: '4.375rem' }}
              onBlur={(e) => {
                const serviceFeeRate = parseFloat(e.target.value || 0.05);
                Object.assign(record, {
                  ...getProfitInfo({ ...record, serviceFeeRate }),
                  serviceFeeRate,
                });
              }}
            />
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
      stockList: [],
      backupStockList: [],
      actionStock: {},
      actionStockIndex: 0,
      columns: lodash.cloneDeep(this.backupColumns),
      sortType: 'profit',
      trendsModalVisible: false,
      addStockModalVisible: false,
    };
  },

  methods: {
    toBackUpStockList() {
      this.backupStockList = lodash.cloneDeep(this.stockList);
    },

    loadStockList(query) {
      stockApi.findAllStocks({ query }).then(({ data }) => {
        let list = data.map((record) => normalize(record));
        if (this.sortType === 'profit') {
          list = this.getListSortByProfit(list);
        } else if (this.sortType === 'percent') {
          list = this.getListSortByPercent(list);
        }

        this.stockList = list;
        this.toBackUpStockList();
      });
    },

    onSearch(query) {
      this.loadStockList(query.trim());
    },

    onDeleteClick(id, index) {
      stockApi
        .deleteStock(id)
        .then(() => {
          this.$message.success('Delete stock success');
          this.stockList.splice(index, 1);
          this.toBackUpStockList();
        })
        .catch(() => {
          this.$message.success('Delete stock failed');
        });
    },

    updateStock(record, stockPrice, index) {
      const originStock = this.backupStockList[index];

      if (stockPrice === originStock.stockPrice && record.stockDate === originStock.stockDate) {
        record.editing = false;
        return;
      }

      return stockApi
        .updateStock(record.id, { ...record, stockPrice })
        .then(() => {
          this.$message.success('Update stock success');
          const profitInfo = getProfitInfo({ ...record, stockPrice });
          Object.assign(record, { ...profitInfo, stockPrice, editing: false });
          Object.assign(this.stockList[index], record);
          this.toBackUpStockList();
        })
        .catch(() => {
          Object.assign(record, originStock);
          this.$message.success('Update stock failed');
        });
    },

    getListSortByProfit(list) {
      return list.sort(({ profit: profitA }, { profit: profitB }) => profitB - profitA);
    },

    getListSortByPercent(list) {
      return list.sort(
        ({ profitPercent: profitPercentA }, { profitPercent: profitPercentB }) =>
          profitPercentB - profitPercentA,
      );
    },

    onSortByProfit() {
      this.stockList = this.getListSortByProfit(this.stockList);
      this.toBackUpStockList();
    },

    onSortByPercent() {
      this.stockList = this.getListSortByPercent(this.stockList);
      this.toBackUpStockList();
    },

    getProfitTagColor(profit) {
      if (profit < 0) {
        return 'green';
      }
      if (profit >= 0 && profit < 200) {
        return '';
      }
      return 'red';
    },

    getProfitPercentTagColor(percent) {
      if (percent < 0) {
        return 'green';
      }
      if (percent >= 0 && percent < 20) {
        return '';
      }
      return 'red';
    },

    getRowClassName({ stockPrice, profit, profitPercent }) {
      if (!stockPrice) {
        return 'no-stock-price';
      }

      if (profit >= 200 || profitPercent >= 20) {
        return 'saleable';
      }

      return null;
    },

    onViewTrends(record, index) {
      this.actionStock = record;
      this.actionStockIndex = index;
      this.trendsModalVisible = true;
    },

    onAddStock() {
      this.addStockModalVisible = true;
    },

    onAddStockSuccess(data) {
      this.stockList.unshift(...data.map((item) => normalize(item)));
      this.toBackUpStockList();
    },
  },

  render() {
    return (
      <div class={name}>
        {/** stock filter area */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <a-input-search
              placeholder="Article Number / Product Name"
              style={{ width: '16rem' }}
              onSearch={this.onSearch}
            />
          </div>

          <a-button
            type="primary"
            size="small"
            icon="file-add"
            style={{ marginRight: '0.5rem' }}
            onClick={this.onAddStock}
          >
            Add Stock
          </a-button>

          {/** Sort and sync */}
          {this.stockList.length > 0 && (
            <div>
              <a-radio-group
                v-model={this.sortType}
                size="small"
                button-style="solid"
                onChange={() => {
                  if (this.sortType === 'profit') {
                    this.onSortByProfit();
                  } else if (this.sortType === 'percent') {
                    this.onSortByPercent();
                  }
                }}
              >
                <a-radio-button value="profit">
                  <a-icon type="sort-ascending" />
                  <span>Profit</span>
                </a-radio-button>
                <a-radio-button value="percent">
                  <a-icon type="sort-ascending" />
                  <span>Percent</span>
                </a-radio-button>
              </a-radio-group>
            </div>
          )}
        </div>

        <a-table
          dataSource={this.stockList}
          columns={this.columns}
          rowKey="id"
          pagination={false}
          rowClassName={this.getRowClassName}
        />

        {/** trends modal */}
        {!lodash.isEmpty(this.actionStock) && (
          <trends-modal
            v-model={this.trendsModalVisible}
            articleNumber={this.actionStock.product.articleNumber}
            productName={this.actionStock.product.name}
            size={this.actionStock.productSize.size}
          />
        )}

        {/** add stock modal */}
        <AddStock v-model={this.addStockModalVisible} onSuccess={this.onAddStockSuccess} />
      </div>
    );
  },
};
</script>
