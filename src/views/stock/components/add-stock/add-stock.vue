<style lang="less" scoped>
@name: add-stock;

/deep/ .ant-modal-body {
  padding: 0;
}
</style>

<script>
import { productApi, stockApi } from '@/api';
import { lodash } from '@/utils';
import StockForm from '../stock-form';

const name = 'add-stock';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      productList: [],
      actionProduct: {},
      stockModalVisible: false,
      formLoading: false,
      searchValue: null,
      confirmLoading: false,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.stockModalVisible = value;
      },
    },
  },
  computed: {
    modalTitle() {
      if (lodash.isEmpty(this.actionProduct)) {
        return 'Add Stock';
      }
      const { articleNumber, name } = this.actionProduct;
      return `Add Stock - [${articleNumber}] ${name}`;
    },
  },
  methods: {
    onShowSizes(product) {
      this.actionProduct = product;
    },

    onSearchProduct(query) {
      this.formLoading = true;
      productApi
        .findProductsByQuery(
          {
            query,
            limit: 6,
          },
          { contentLoading: false },
        )
        .then(({ data }) => {
          this.productList = data;
        })
        .finally(() => (this.formLoading = false));
    },

    addStock() {
      if (!this.$refs.stockForm) {
        return;
      }
      const stocks = this.$refs.stockForm.exportStocks();
      if (Object.values(stocks).every((value) => value === 0)) {
        return;
      }
      this.confirmLoading = true;
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
          promiseList.push(
            stockApi.createStock(stock, { contentLoading: false }).then(({ data }) => data),
          );
        }
      });
      Promise.all(promiseList)
        .then((addedStocks) => {
          this.$message.success('add stocks success');
          this.stockModalVisible = false;
          this.productList = [];
          this.actionProduct = {};
          this.searchValue = null;
          this.onClose();
          this.$emit('success', addedStocks);
        })
        .finally(() => (this.confirmLoading = false));
    },

    onClose() {
      this.productList = [];
      this.actionProduct = {};
      this.searchValue = null;
      this.$emit('input', false);
    },
  },
  render() {
    return (
      <div class={name}>
        {/** stock modal */}
        <a-modal
          v-model={this.stockModalVisible}
          title={this.modalTitle}
          width="60%"
          maskClosable={false}
          okText="Confirm to Add"
          cancelText="Close"
          confirmLoading={this.confirmLoading}
          onOk={this.addStock}
          onCancel={this.onClose}
        >
          <a-spin spinning={this.formLoading}>
            <div style={{ padding: '0.5rem 1rem', background: '#f8f8f8' }}>
              {/** add stock: search */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '0.75rem 0' }}>
                <a-input-search
                  v-model={this.searchValue}
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
                      this.actionProduct = {};
                    }}
                  />
                )}
              </div>
              {/** add stock: card */}
              {this.productList.length > 0 && (
                <div style={{ paddingBottom: '0.75rem' }}>
                  <a-row gutter={8}>
                    {this.productList.map((product) => (
                      <a-col span={8} key={product.id}>
                        <product-card data={product} style={{ marginBottom: '0.5rem' }}>
                          <a-button
                            type="primary"
                            size="small"
                            slot="footer"
                            onClick={() => this.onShowSizes(product)}
                          >
                            Show Sizes
                          </a-button>
                        </product-card>
                      </a-col>
                    ))}
                  </a-row>
                </div>
              )}

              {!lodash.isEmpty(this.actionProduct) && (
                <StockForm ref="stockForm" product={this.actionProduct} />
              )}
            </div>
          </a-spin>
        </a-modal>
      </div>
    );
  },
};
</script>
