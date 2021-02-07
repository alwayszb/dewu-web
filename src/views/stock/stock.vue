<style lang="less" scoped>
@import './stock.less';
</style>

<script>
import { ProductCard } from '@/components';
import { productApi, sellSnapshotApi, stockApi } from '@/api';
import { time } from '@/utils';
import { cloneDeep, get, isEmpty, round } from 'lodash';
import StockForm from './components/stock-form';

const name = 'stock';

const normalizeSellItem = ({ stockPrice, serviceFeeRate }, sellItem) => {
  const { price } = sellItem;
  const actualPrice = price / 100;
  const techServiceFee = round(actualPrice * serviceFeeRate, 2);
  const transferFee = round(actualPrice * 0.01, 2);
  const serviceFee = round(techServiceFee + transferFee + 33, 2);
  const salesRevenue = round(actualPrice - serviceFee, 2);
  const profit = round(salesRevenue - stockPrice, 2);
  const profitPercent = round((profit / stockPrice) * 100, 2);
  return {
    ...sellItem,
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
    synced() {
      return (
        this.renderedStockList.length > 0 &&
        this.renderedStockList.every(({ sellItem }) => !isEmpty(sellItem))
      );
    },
    renderedStockList() {
      const { search } = this.filterOptions;
      if (!search || !search.trim()) {
        return this.stockList;
      }
      return this.stockList.filter(({ product }) => product.name.includes(search));
    },
  },

  data() {
    this.name = name;
    this.backupColumns = [
      {
        dataIndex: 'product.image',
        title: 'Product',
        customRender: (value, record) => {
          return <img src={value} alt={record.product.title} height={40} />;
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
          if (record.status === 'sold') {
            return value;
          }
          return record.editing ? (
            <a-input-number
              ref={`stockPrice-${index}`}
              v-model={record.stockPrice}
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
        width: 110,
        customRender: (value, record, index) => {
          return (
            <div>
              {record.status === 'in_stock' && !!record.stockPrice && (
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
        productType: '',
      },
      columns: cloneDeep(this.backupColumns),
      sortType: 'profit',
    };
  },

  watch: {
    synced(val) {
      if (val) {
        this.$message.success('All stock price synced');
        this.sortType = 'profit';
        this.onSortByProfit();
      }
    },
  },

  methods: {
    toBackUpStockList() {
      this.backupStockList = cloneDeep(this.stockList);
    },

    loadStockList() {
      stockApi.findAllStocks(this.filterOptions).then(({ data }) => {
        this.stockList = data.map((item) => ({
          ...item,
          editing: false,
          sellItem: {},
          serviceFeeRate: 0.05,
        }));
        this.toBackUpStockList();
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
          const { spuId } = this.actionProduct;
          const stock = {
            sizeId,
            spuId,
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
        record.stockPrice === originStock.stockPrice &&
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
      const { sizeId, soldDate, soldPrice, spuId, stockDate, stockPrice } = record;
      const stock = {
        sizeId,
        soldDate,
        soldPrice,
        spuId,
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

    addDuPriceColumn(index) {
      this.columns.splice(
        index,
        0,
        {
          dataIndex: 'sellItem',
          title: 'Du Price',
          width: 230,
          customRender: (value, record) => {
            const { sellItem, stockPrice } = record;

            if (!stockPrice || !sellItem) {
              return '-';
            }

            if (sellItem === 'failed') {
              return (
                <a-button
                  type="link"
                  icon="sync"
                  onClick={() => {
                    record.sellItem = {};
                    this.getSellSnapshot(record);
                  }}
                />
              );
            }

            const {
              tradeDesc,
              actualPrice,
              techServiceFee,
              transferFee,
              salesRevenue,
              profit,
              profitPercent,
            } = sellItem;

            const valueDisplay = (
              <div>
                <div>
                  <a-tag>
                    {tradeDesc} | {actualPrice}
                  </a-tag>
                  <a-tooltip
                    title={`${actualPrice} - ${techServiceFee} - ${transferFee} - 33 = ${salesRevenue}`}
                  >
                    <a-tag>到手: {salesRevenue}</a-tag>
                  </a-tooltip>
                </div>
                <div style={{ marginTop: '0.25rem' }}>
                  <a-tag color={profit >= 200 ? 'green' : ''}>
                    <span>利润: {profit}</span>
                  </a-tag>
                  <a-tag color={profitPercent >= 20 ? 'green' : ''}>{profitPercent}%</a-tag>
                </div>
              </div>
            );
            return !isEmpty(sellItem) ? valueDisplay : <a-spin />;
          },
        },
        {
          dataIndex: 'serviceFeeRate',
          title: 'SFR',
          customRender: (value, record) => {
            return (
              <a-input-number
                v-model={record.serviceFeeRate}
                style={{ width: '4.375rem' }}
                onChange={() => {
                  record.sellItem = normalizeSellItem(record, record.sellItem);
                }}
              />
            );
          },
        },
      );
    },

    loadDuPrices() {
      if (!this.columns.find((item) => item.dataIndex === 'sellItem')) {
        const index = this.columns.findIndex((item) => item.dataIndex === 'stockPrice') + 1;
        this.addDuPriceColumn(index);
      }

      const promiseList = [];
      this.renderedStockList
        .filter(({ stockPrice }) => stockPrice)
        .forEach((stock, index) => {
          setTimeout(() => {
            promiseList.push(this.getSellSnapshot(stock));
          }, index * 1000);
        });
    },

    getSellSnapshot(stock) {
      const { spuId, productSize } = stock;
      const { skuId } = productSize;
      return sellSnapshotApi
        .getSellSnapshotBySpuId(spuId)
        .then(({ data }) => {
          const foundSellSnapshot = data.find((item) => item.skuId === skuId);
          if (foundSellSnapshot) {
            setTimeout(() => {
              stock.sellItem = normalizeSellItem(stock, foundSellSnapshot.sellItem);
            }, 300);
          } else {
            stock.sellItem = null;
          }
        })
        .catch(() => {
          stock.sellItem = 'failed';
        });
    },

    onSortByProfit() {
      this.stockList = this.stockList.sort(
        ({ sellItem: { profit: profitA } }, { sellItem: { profit: profitB } }) => profitB - profitA,
      );
      this.toBackUpStockList();
    },

    onSortByPercent() {
      this.stockList = this.stockList.sort(
        (
          { sellItem: { profitPercent: profitPercentA } },
          { sellItem: { profitPercent: profitPercentB } },
        ) => profitPercentB - profitPercentA,
      );
      this.toBackUpStockList();
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
                    <ProductCard data={product}>
                      <a-button
                        type="primary"
                        size="small"
                        slot="footer"
                        onClick={() => this.onAddStock(product)}
                      >
                        Add Stock
                      </a-button>
                    </ProductCard>
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
              v-model={this.filterOptions.productType}
              size="small"
              button-style="solid"
              style={{ marginLeft: '0.5rem' }}
              onChange={(e) => {
                this.filterOptions.search = e.target.value;
              }}
            >
              <a-radio-button value="">All</a-radio-button>
              <a-radio-button value="Air Jordan 1">AJ1</a-radio-button>
              <a-radio-button value="Air Force 1">AF1</a-radio-button>
              <a-radio-button value="Dunk">Dunk</a-radio-button>
            </a-radio-group>
          </div>

          {/** Sort and sync */}
          {this.filterOptions.status === 'in_stock' && this.stockList.length > 0 && (
            <div>
              {this.synced && (
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
              )}
              <a-button
                type="primary"
                size="small"
                icon="sync"
                style={{ marginLeft: '0.5rem' }}
                onClick={this.loadDuPrices}
              >
                Sync Price
              </a-button>
            </div>
          )}
        </div>

        <a-table
          dataSource={this.renderedStockList}
          columns={this.columns}
          rowKey="id"
          size="small"
          pagination={false}
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
      </div>
    );
  },
};
</script>
