<style lang="less" scoped>
@import './stock.less';
</style>

<script>
import { productApi, productSizeApi, stockApi } from '@/api';
import { time } from '@/utils';
import { cloneDeep, get, round } from 'lodash';
import StockForm from './components/stock-form';
import { TrendsModal } from '@/views/product/search/components';

const name = 'stock';

const getPriceInfo = ({ stockPrice, serviceFeeRate, realTimePrice }) => {
  const actualPrice = realTimePrice / 100;
  const techServiceFee = round(actualPrice * serviceFeeRate, 2);
  const transferFee = round(actualPrice * 0.01, 2);
  const serviceFee = round(techServiceFee + transferFee + 33, 2);
  const salesRevenue = round(actualPrice - serviceFee, 2);
  const profit = round(salesRevenue - stockPrice, 2);
  const profitPercent = round((profit / stockPrice) * 100, 2);
  return {
    actualPrice,
    techServiceFee,
    transferFee,
    salesRevenue,
    profit,
    profitPercent,
  };
};

export default {
  name,

  created() {
    this.loadStockList();
  },

  computed: {
    renderedStockList() {
      const { search, category: filterCategory } = this.filterOptions;
      return this.stockList.filter(
        ({ product, category }) =>
          product.name.includes(search) && (!filterCategory || category === filterCategory),
      );
    },
  },

  data() {
    this.name = name;
    this.backupColumns = [
      {
        dataIndex: 'product.image',
        title: 'Product',
        width: 100,
        customRender: (value, record) => {
          return <img src={value} alt={record.product.title} width={80} />;
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
        dataIndex: 'priceInfo.stockPrice',
        title: 'Stock Price',
        width: 120,
        customRender: (value, record, index) => {
          if (record.status === 'sold') {
            return value;
          }
          return record.editing ? (
            <a-input-number
              ref={`stockPrice-${index}`}
              v-model={record.priceInfo.stockPrice}
              style={{ width: '6rem' }}
              onBlur={() => {
                this.updateStock(record, index);
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
        dataIndex: 'priceInfo',
        title: 'Price Info',
        width: 230,
        customRender: (value) => {
          const {
            actualPrice,
            techServiceFee,
            transferFee,
            salesRevenue,
            profit,
            profitPercent,
            tradeDesc,
            snapshotDate,
          } = value;

          const valueDisplay = (
            <div>
              <div>
                <a-tooltip title={time.formatToTime(snapshotDate)}>
                  <a-tag>
                    {tradeDesc} | {actualPrice}
                  </a-tag>
                </a-tooltip>
                <a-tooltip
                  title={`${actualPrice} - ${techServiceFee} - ${transferFee} - 33 = ${salesRevenue}`}
                >
                  <a-tag>到手: {salesRevenue}</a-tag>
                </a-tooltip>
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
        dataIndex: 'serviceFeeRate',
        title: 'SFR',
        customRender: (value, record) => {
          return <a-input-number v-model={record.serviceFeeRate} style={{ width: '4.375rem' }} />;
        },
      },
      {
        dataIndex: 'status',
        title: 'Status',
        width: 90,
        customRender: (value, { stockDate, soldPrice, soldDate }) => {
          if (value === 'in_stock') {
            return (
              <a-tooltip title={`Stock Date: ${time.formatToDate(stockDate)}`}>
                <a-tag>In Stock</a-tag>
              </a-tooltip>
            );
          }
          if (value === 'sold') {
            return (
              <div>
                <a-tooltip title={`Sold Date: ${time.formatToDate(soldDate)}`}>
                  <a-tag>Sold: {soldPrice}</a-tag>
                </a-tooltip>
              </div>
            );
          }
          return '-';
        },
      },
      {
        title: 'Actions',
        width: 140,
        customRender: (value, record, index) => {
          return (
            <div>
              <a-button size="small" icon="stock" onClick={() => this.onViewTrends(record)} />

              {record.status === 'in_stock' && !!record.priceInfo.stockPrice && (
                <a-tooltip title="set sold">
                  <a-button
                    type="primary"
                    size="small"
                    icon="check"
                    onClick={() => this.onSoldClick(record, index)}
                  />
                </a-tooltip>
              )}

              {record.status === 'in_stock' && (
                <a-popconfirm
                  title="Confirm to duplicate?"
                  onConfirm={() => this.onDuplicateClick(record, index)}
                >
                  <a-button size="small" icon="copy" />
                </a-popconfirm>
              )}
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
      productList: [],
      actionProduct: {},
      stockModalVisible: false,
      stockList: [],
      backupStockList: [],
      actionStock: {},
      actionStockIndex: 0,
      soldModalVisible: false,
      filterOptions: {
        search: '',
        status: 'in_stock',
        category: null,
      },
      columns: cloneDeep(this.backupColumns),
      sortType: 'profit',
      trendsModalVisible: false,
      actionRecordProduct: {
        spuId: null,
        name: null,
        articleNumber: null,
        productSizes: [],
      },
    };
  },

  watch: {},

  methods: {
    toBackUpStockList() {
      this.backupStockList = cloneDeep(this.stockList);
    },

    loadStockList() {
      stockApi.findAllStocks(this.filterOptions).then(({ data }) => {
        this.stockList = data.map(({ stockPrice, sellSnapshot, ...res }) => ({
          ...res,
          editing: false,
          serviceFeeRate: 0.05,
          priceInfo: {
            ...getPriceInfo({
              stockPrice,
              serviceFeeRate: 0.05,
              realTimePrice: sellSnapshot ? sellSnapshot.price : '-',
            }),
            stockPrice,
            tradeDesc: sellSnapshot ? sellSnapshot.tradeDesc : '-',
            snapshotDate: sellSnapshot ? sellSnapshot.createdAt : '-',
          },
        }));
        if (this.sortType === 'profit') {
          this.onSortByProfit();
        } else if (this.sortType === 'percent') {
          this.onSortByPercent();
        }
      });
    },

    onAddStock(product) {
      this.actionProduct = product;
      this.stockModalVisible = true;
    },

    onSearchProduct(query) {
      productApi
        .findProductsByQuery({
          query,
          limit: 4,
        })
        .then(({ data }) => {
          this.productList = data;
        });
    },

    addStock() {
      const stocks = this.$refs.stockForm.exportStocks();
      const promiseList = [];
      Object.keys(stocks).map((sizeId) => {
        const count = stocks[sizeId];
        for (let i = 0; i < count; i++) {
          const { articleNumber } = this.actionProduct;
          const stock = {
            sizeId,
            articleNumber,
            stockDate: new Date(),
            stockPrice: 0,
          };
          promiseList.push(stockApi.createStock(stock));
        }
      });
      this.stockModalVisible = false;
      Promise.all(promiseList).then((result) => {
        this.$message.success('add stocks success');
        const newAdded = result
          .map(({ data }) => ({ ...data, editing: false }))
          .sort(({ productSizeA }, { productSizeB }) => productSizeA - productSizeB);
        this.stockList = [...newAdded, ...this.stockList];
        this.toBackUpStockList();
      });
    },

    onDeleteClick(id, index) {
      stockApi
        .deleteStock(id)
        .then(() => {
          this.$message.success('Delete stock success');
          this.stockList.splice(index, 1);
        })
        .catch(() => {
          this.$message.success('Delete stock failed');
        });
    },

    updateStock(record, index) {
      const originStock = this.backupStockList[index];

      if (
        record.priceInfo.stockPrice === originStock.priceInfo.stockPrice &&
        record.stockDate === originStock.stockDate &&
        record.soldPrice === originStock.soldPrice &&
        record.soldDate === originStock.soldDate
      ) {
        record.editing = false;
        return;
      }

      if (!record.stockPrice) {
        record.stockPrice = 0;
      }

      return stockApi
        .updateStock(record.id, record)
        .then(() => {
          this.$message.success('Update stock success');
          record.editing = false;
          record.profit = record.soldPrice - record.stockPrice;
          Object.assign(this.stockList[index], record);
          this.toBackUpStockList();
        })
        .catch(() => {
          Object.assign(record, originStock);
          this.$message.success('Update stock failed');
        });
    },

    onDuplicateClick(record, index) {
      const { articleNumber, sizeId, soldDate, soldPrice, stockDate, stockPrice } = record;
      const stock = {
        articleNumber,
        sizeId,
        soldDate,
        soldPrice,
        stockDate,
        stockPrice,
      };
      stockApi
        .createStock(stock)
        .then(({ data }) => {
          this.$message.success('Duplicate stock success');
          this.stockList.splice(index, 0, { ...record, id: data.id });
        })
        .catch(() => {
          this.$message.success('Duplicate stock failed');
        });
    },

    onSoldClick(record, index) {
      this.actionStock = record;
      this.actionStockIndex = index;
      this.soldModalVisible = true;
    },

    setSold() {
      this.updateStock(
        { ...this.actionStock, status: 'sold', soldDate: new Date() },
        this.actionStockIndex,
      ).finally(() => {
        this.soldModalVisible = false;
      });
    },

    onSortByProfit() {
      this.stockList = this.stockList.sort(
        ({ priceInfo: { profit: profitA } }, { priceInfo: { profit: profitB } }) =>
          profitB - profitA,
      );
      this.toBackUpStockList();
    },

    onSortByPercent() {
      this.stockList = this.stockList.sort(
        (
          { priceInfo: { profitPercent: profitPercentA } },
          { priceInfo: { profitPercent: profitPercentB } },
        ) => profitPercentB - profitPercentA,
      );
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

    getRowClassName({ priceInfo }) {
      if (priceInfo.profit >= 200 || priceInfo.profitPercent >= 20) {
        return 'saleable';
      }
      return null;
    },

    async onViewTrends({ product }) {
      const productSizes = await productSizeApi
        .findSizesByArticleNumber(product.articleNumber)
        .then(({ data }) => data);
      this.actionRecordProduct = {
        ...product,
        productSizes,
      };
      this.trendsModalVisible = true;
    },
  },

  render() {
    return (
      <div class={name}>
        <div class={`${name}-header`}>
          {/** add stock: search */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '0.75rem 0' }}>
            <a-input-search
              placeholder="Search product to add stock"
              style={{ width: '20rem' }}
              onSearch={this.onSearchProduct}
            />
            {this.productList.length !== 0 && (
              <a-button
                type="link"
                icon="disconnect"
                onClick={() => {
                  this.productList = [];
                }}
              />
            )}
          </div>
          {/** add stock: card */}
          {this.productList.length > 0 && (
            <div style={{ paddingBottom: '0.75rem' }}>
              <Row space={8}>
                {this.productList.map((product) => (
                  <Cell width={6} key={product.id}>
                    <product-card data={product}>
                      <a-button
                        type="primary"
                        size="small"
                        slot="footer"
                        onClick={() => this.onAddStock(product)}
                      >
                        Add Stock
                      </a-button>
                    </product-card>
                  </Cell>
                ))}
              </Row>
            </div>
          )}
        </div>

        {/** stock filter area */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem 0.75rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <a-input-search
              v-model={this.filterOptions.search}
              placeholder="Quick search"
              style={{ width: '12rem' }}
            />

            {/** sold type filter */}
            <a-radio-group
              v-model={this.filterOptions.status}
              size="small"
              button-style="solid"
              style={{ marginLeft: '0.5rem' }}
              onChange={() => {
                this.columns = cloneDeep(this.backupColumns);
                this.loadStockList();
              }}
            >
              <a-radio-button value="">All</a-radio-button>
              <a-radio-button value="in_stock">In Stock</a-radio-button>
              <a-radio-button value="sold">Sold</a-radio-button>
            </a-radio-group>

            {/** product type filter */}
            <a-radio-group
              v-model={this.filterOptions.category}
              size="small"
              button-style="solid"
              style={{ marginLeft: '0.5rem' }}
            >
              <a-radio-button value={null}>All</a-radio-button>
              <a-radio-button value="AJ1">AJ1</a-radio-button>
              <a-radio-button value="AF1">AF1</a-radio-button>
              <a-radio-button value="Dunk">Dunk</a-radio-button>
            </a-radio-group>
          </div>

          {/** Sort and sync */}
          {this.filterOptions.status === 'in_stock' && this.stockList.length > 0 && (
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
          dataSource={this.renderedStockList}
          columns={this.columns}
          rowKey="id"
          size="small"
          pagination={false}
          style={{ background: '#fff' }}
          rowClassName={this.getRowClassName}
        />

        {/** stock modal */}
        <a-modal v-model={this.stockModalVisible} width={600} onOk={this.addStock}>
          <div slot="title">
            <span style={{ color: '#1890ff', marginRight: '0.5rem' }}>
              {this.actionProduct.articleNumber}
            </span>
            <span style={{ fontWeight: 'normal', color: '#999' }}>{this.actionProduct.name}</span>
          </div>
          <StockForm ref="stockForm" product={this.actionProduct} />
        </a-modal>

        {/** sold modal */}
        <a-modal v-model={this.soldModalVisible} width={500} onOk={this.setSold}>
          <div slot="title" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={get(this.actionStock, 'product.image')}
              alt={get(this.actionStock, 'product.name')}
              height={40}
            />
            <span style={{ marginLeft: '0.5rem' }}>
              {get(this.actionStock, 'product.articleNumber')}
            </span>
          </div>
          <a-form-model labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <a-form-model-item label="Product">
              <span>{get(this.actionStock, 'product.name')}</span>
            </a-form-model-item>
            <a-form-model-item label="Size">
              <span>{get(this.actionStock, 'productSize.size')}</span>
            </a-form-model-item>
            <a-form-model-item label="Stock Price">
              <span>{this.actionStock.stockPrice}</span>
            </a-form-model-item>
            <a-form-model-item label="Sold Price">
              <a-input-number v-model={this.actionStock.soldPrice} />
            </a-form-model-item>
          </a-form-model>
        </a-modal>

        {/** trends modal */}
        <TrendsModal v-model={this.trendsModalVisible} product={this.actionRecordProduct} />
      </div>
    );
  },
};
</script>
