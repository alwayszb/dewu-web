<style lang="less" scoped>
/deep/ .ant-modal-body {
  padding: 0;
}
</style>

<script>
import { productApi } from '@/api';
import { lodash } from '@/utils';

const name = 'product-select';

export default {
  name,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    submit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      productList: [],
      actionProduct: {},
      modalVisible: false,
      formLoading: false,
      searchValue: null,
      confirmLoading: false,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.modalVisible = value;
      },
    },
  },
  computed: {
    modalTitle() {
      if (lodash.isEmpty(this.actionProduct)) {
        return 'Select Product';
      }
      const { articleNumber, name } = this.actionProduct;
      return `Select Product - [${articleNumber}] ${name}`;
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

    addRecord() {
      if (!this.$refs.sizeList) {
        return;
      }
      const selectedProducts = this.$refs.sizeList.exportData();
      if (Object.values(selectedProducts).every((value) => value === 0)) {
        return;
      }
      this.confirmLoading = true;
      const promiseList = [];
      Object.keys(selectedProducts).map((sizeId) => {
        const count = selectedProducts[sizeId];
        for (let i = 0; i < count; i++) {
          const { articleNumber } = this.actionProduct;
          const record = {
            sizeId,
            articleNumber,
          };
          promiseList.push(this.submit(record));
        }
      });
      Promise.all(promiseList)
        .then((addedRecords) => {
          this.$message.success('add success');
          this.modalVisible = false;
          this.productList = [];
          this.actionProduct = {};
          this.searchValue = null;
          this.onClose();
          this.$emit('success', addedRecords);
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
        <a-modal
          v-model={this.modalVisible}
          title={this.modalTitle}
          width="60%"
          maskClosable={false}
          okText="CONFIRM"
          cancelText="CLOSE"
          confirmLoading={this.confirmLoading}
          onOk={this.addRecord}
          onCancel={this.onClose}
        >
          <a-spin spinning={this.formLoading}>
            <div style={{ padding: '0.5rem 1rem', background: '#f8f8f8' }}>
              {/** search */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '0.75rem 0' }}>
                <a-input-search
                  v-model={this.searchValue}
                  placeholder="Search product"
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
              {/** product card */}
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
                <size-list ref="sizeList" product={this.actionProduct} />
              )}
            </div>
          </a-spin>
        </a-modal>
      </div>
    );
  },
};
</script>
