<style lang="less" scoped>
@import './in-stock.less';
</style>

<script>
import { salesRecordApi, stockApi } from '@/api';
import { lodash } from '@/utils';
import AddStock from '@/views/stock/components/add-stock';
import StockSummary from '@/views/stock/components/stock-summary';
import SaleForm from '@/views/stock/components/sale-form';
import { getProfitInfo, normalize, getColumns, SORT_TYPES } from './in-stock';

const name = 'in-stock';

export default {
  name,

  props: {
    showImage: {
      type: Boolean,
      default: true,
    },
  },

  created() {
    this.loadStockList();
  },

  data() {
    return {
      stockList: [],
      backupStockList: [],
      actionStock: {},
      columns: getColumns(this),
      sortType: SORT_TYPES.USE_PROFIT_PERCENT,
      trendsModalVisible: false,
      addStockModalVisible: false,
      saleModalVisible: false,
      saleFormData: null,
      saleFormSubmitLoading: false,
      searchValue: '',
    };
  },

  watch: {
    showImage: {
      immediate: true,
      handler() {
        this.columns = getColumns(this);
      },
    },
  },

  methods: {
    toBackUpStockList() {
      this.backupStockList = lodash.cloneDeep(this.stockList);
    },

    loadStockList(query) {
      stockApi.findAllStocks({ query }).then(({ data }) => {
        let list = data.map((record) => normalize(record));
        if (this.sortType === SORT_TYPES.USE_PROFIT) {
          list = this.getListSortByProfit(list);
        } else if (this.sortType === SORT_TYPES.USE_PROFIT_PERCENT) {
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

    updateStock(record, updateProps, index, originStock) {
      return stockApi
        .updateStock(record.id, { ...record, ...updateProps })
        .then(() => {
          this.$message.success('Update stock success');
          const profitInfo = getProfitInfo({ ...record, ...updateProps });
          Object.assign(record, { ...profitInfo, ...updateProps, editing: false });
          Object.assign(this.stockList[index], record);
          this.toBackUpStockList();
        })
        .catch(() => {
          Object.assign(record, originStock);
          this.$message.success('Update stock failed');
        });
    },

    updateStockPrice(record, stockPrice, index) {
      const originStock = this.backupStockList[index];

      if (stockPrice === originStock.stockPrice) {
        record.editing = false;
        return;
      }

      return this.updateStock(record, { stockPrice }, index, originStock);
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

    onSale(record, index) {
      this.actionStock = record;
      this.actionStockIndex = index;
      this.saleFormSubmitLoading = false;
      this.saleModalVisible = true;
    },

    onSaleFormSubmit() {
      this.saleFormSubmitLoading = true;
      const {
        value: { soldPrice, soldDate, expressFee, otherFee, description },
        profitDetail: { totalServiceFee, profit },
      } = this.saleFormData;
      const salesRecord = {
        stockId: this.actionStock.id,
        soldPrice,
        soldDate,
        expressFee,
        otherFee,
        description,
        serviceFee: totalServiceFee,
        profit,
      };
      salesRecordApi
        .createSalesRecord(salesRecord)
        .then(() => {
          this.$message.success('Stock sales record added');
          this.saleModalVisible = false;
          this.stockList.splice(this.actionStockIndex, 1);
          this.toBackUpStockList();
        })
        .finally(() => (this.saleFormSubmitLoading = false));
    },

    onExpectPriceChange(record, price, index) {
      const originStock = this.backupStockList[index];
      const expectPrice = price ? parseInt(price, 10) : 0;
      if (expectPrice === (originStock.expectPrice || 0)) {
        return;
      }
      return this.updateStock(
        record,
        { expectPrice: parseInt(expectPrice, 10) },
        index,
        originStock,
      );
    },
  },

  render() {
    return (
      <div class={name}>
        {/** stock filter area */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem 0.75rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <a-input-search
              v-model={this.searchValue}
              placeholder="Article Number / Product Name"
              style={{ width: '16rem' }}
              onSearch={this.onSearch}
            />
            <a-button
              icon="sync"
              style={{ margin: '0 0.5rem' }}
              onClick={() => this.loadStockList(this.searchValue)}
            />
            <a-button
              type="primary"
              icon="file-add"
              style={{ margin: '0 0.5rem' }}
              onClick={this.onAddStock}
            >
              ADD STOCK
            </a-button>

            {/** Sort and sync */}
            {this.stockList.length > 0 && (
              <div>
                <a-radio-group
                  v-model={this.sortType}
                  button-style="solid"
                  onChange={() => {
                    if (this.sortType === SORT_TYPES.USE_PROFIT) {
                      this.onSortByProfit();
                    } else if (this.sortType === SORT_TYPES.USE_PROFIT_PERCENT) {
                      this.onSortByPercent();
                    }
                  }}
                >
                  <a-radio-button value={SORT_TYPES.USE_PROFIT}>
                    <a-icon type="sort-ascending" />
                    <span>PROFIT</span>
                  </a-radio-button>
                  <a-radio-button value={SORT_TYPES.USE_PROFIT_PERCENT}>
                    <a-icon type="sort-ascending" />
                    <span>PERCENT</span>
                  </a-radio-button>
                </a-radio-group>
              </div>
            )}
          </div>

          {this.stockList.length > 0 && <StockSummary stocks={this.stockList} />}
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

        {!lodash.isEmpty(this.actionStock) && (
          <a-modal
            v-model={this.saleModalVisible}
            title={`SALE FORM - ${this.actionStock.product.name}`}
            width={800}
            centered
            okText="SUBMIT"
            cancelText="CLOSE"
            confirmLoading={this.saleFormSubmitLoading}
            onOk={this.onSaleFormSubmit}
          >
            <a-spin spinning={this.saleFormSubmitLoading}>
              {!lodash.isEmpty(this.actionStock) && (
                <SaleForm
                  stock={this.actionStock}
                  onChange={(value, profitDetail) => (this.saleFormData = { value, profitDetail })}
                />
              )}
            </a-spin>
          </a-modal>
        )}
      </div>
    );
  },
};
</script>
