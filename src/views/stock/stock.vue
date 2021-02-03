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

export default {
  name,

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
      },
      {
        dataIndex: 'product.articleNumber',
        title: 'Article Number',
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
                this.updateStock(record, index);
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
        customRender: (value, { stockPrice, stockDate, soldPrice, soldDate, profit }) => {
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
                <div style={{ marginTop: '0.25rem' }}>
                  {profit > 0 ? (
                    <div>
                      <a-tag color="green">
                        <span>Profit: {profit}</span>
                      </a-tag>
                      <a-tag>
                        <span>{round((profit / stockPrice) * 100, 2)}%</span>
                      </a-tag>
                    </div>
                  ) : (
                    <a-tag color="red">Loss: {profit}</a-tag>
                  )}
                </div>
              </div>
            );
          }
          return '-';
        },
      },
      {
        title: 'Actions',
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
                  onConfirm={() => this.onDuplicateClick(record)}
                >
                  <a-button size="small" icon="copy" />
                </a-popconfirm>
              )}
              <a-popconfirm
                title="Confirm to delete?"
                onConfirm={() => this.onDeleteClick(record.id)}
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
        status: 'in_stock',
      },
      columns: cloneDeep(this.backupColumns),
    };
  },

  created() {
    this.loadStockList();
  },

  methods: {
    loadStockList() {
      stockApi.findAllStocks(this.filterOptions).then(({ data }) => {
        this.stockList = data.map((item) => ({ ...item, editing: false }));
        this.backupStockList = cloneDeep(this.stockList);
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
      Promise.all(promiseList).then(() => {
        this.$message.success('add stocks success');
        this.loadStockList();
      });
    },

    onDeleteClick(id) {
      stockApi
        .deleteStock(id)
        .then(() => {
          this.$message.success('Delete stock success');
          this.loadStockList();
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
          this.backupStockList = cloneDeep(this.stockList);
        })
        .catch(() => {
          Object.assign(record, originStock);
          this.$message.success('Update stock failed');
        });
    },

    onDuplicateClick(record) {
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
        .then(() => {
          this.$message.success('Duplicate stock success');
          this.loadStockList();
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

    loadDuPrices() {
      if (!this.columns.find((item) => item.dataIndex === 'sellItem')) {
        const index = this.columns.findIndex((item) => item.dataIndex === 'stockPrice') + 1;
        this.columns.splice(
          index,
          0,
          {
            dataIndex: 'sellItem',
            title: 'Du Price',
            customRender: (value, { stockPrice, serviceFeeRate }) => {
              if (!stockPrice || !value) {
                return '-';
              }
              const { tradeDesc, price } = value;
              const actualPrice = price / 100;
              const techServiceFee = round(actualPrice * serviceFeeRate, 2);
              const transferFee = round(actualPrice * 0.01, 2);
              const serviceFee = round(techServiceFee + transferFee + 33, 2);
              const salesRevenue = round(actualPrice - serviceFee, 2);
              const diffPrice = round(salesRevenue - stockPrice, 2);
              const diffPercent = round((diffPrice / stockPrice) * 100, 2);
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
                    <a-tag>
                      <span>利润: {diffPrice}</span>
                    </a-tag>
                    <a-tag color={diffPercent >= 20 ? 'green' : ''}>{diffPercent}%</a-tag>
                  </div>
                </div>
              );
              return !isEmpty(value) ? valueDisplay : <a-spin />;
            },
          },
          {
            dataIndex: 'serviceFeeRate',
            title: 'SFR',
            customRender: (value, record) => {
              return (
                <a-input-number v-model={record.serviceFeeRate} style={{ width: '4.375rem' }} />
              );
            },
          },
        );
      }
      // init
      this.stockList = this.stockList.map((stock) => ({
        ...stock,
        sellItem: {},
        serviceFeeRate: 0.05,
      }));

      this.stockList.forEach((stock) => {
        if (stock.stockPrice) {
          const { spuId, productSize } = stock;
          const { skuId } = productSize;
          sellSnapshotApi.getSellSnapshotBySpuId(spuId).then(({ data }) => {
            const { sellItem } = data.find((item) => item.skuId === skuId);
            setTimeout(() => {
              stock.sellItem = sellItem;
            }, 300);
          });
        }
      });
    },
  },

  render() {
    return (
      <div class={name}>
        <div class={`${name}-header`}>
          <div style={{ marginTop: '0.75rem', width: '20rem' }}>
            <a-input-search
              onSearch={this.onSearchProduct}
              placeholder="Search product to add stock"
            />
          </div>
        </div>

        <div style={{ padding: '0 0.75rem 0.5rem' }}>
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

        <div style={{ display: 'flex', padding: '0 0.75rem 0.75rem', alignItems: 'center' }}>
          <a-radio-group
            v-model={this.filterOptions.status}
            onChange={() => {
              this.columns = cloneDeep(this.backupColumns);
              this.loadStockList();
            }}
            style={{ flex: 1 }}
          >
            <a-radio-button value="">All</a-radio-button>
            <a-radio-button value="in_stock">In Stock</a-radio-button>
            <a-radio-button value="sold">Sold</a-radio-button>
          </a-radio-group>

          {this.filterOptions.status === 'in_stock' && this.stockList.length > 0 && (
            <a-button
              type="primary"
              size="small"
              icon="sync"
              style={{ marginLeft: '0.5rem' }}
              onClick={this.loadDuPrices}
            >
              Real-time Price
            </a-button>
          )}
        </div>

        <a-table
          dataSource={this.stockList}
          columns={this.columns}
          rowKey="id"
          size="small"
          pagination={false}
        />

        <a-modal v-model={this.stockModalVisible} width={600} onOk={this.addStock}>
          <div slot="title">
            <span style={{ color: '#1890ff', marginRight: '0.5rem' }}>
              {this.actionProduct.articleNumber}
            </span>
            <span style={{ fontWeight: 'normal', color: '#999' }}>{this.actionProduct.name}</span>
          </div>
          <StockForm ref="stockForm" product={this.actionProduct} />
        </a-modal>

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
