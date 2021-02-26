<script>
import { lodash, time } from '@/utils';
const name = 'sale-form';

const DEFAULT_FORM_DATA = {
  soldPrice: null,
  soldDate: time.now(),
  pkgAndIdFee: 33,
  expressFee: 13,
  otherFee: 0,
  serviceFeeRate: 0.05,
  description: null,
};

export default {
  name,

  props: {
    stock: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      formData: {
        ...DEFAULT_FORM_DATA,
      },
    };
  },

  computed: {
    profitDetail() {
      const { soldPrice, serviceFeeRate, pkgAndIdFee, expressFee, otherFee } = this.formData;
      const { stockPrice } = this.stock;

      if (!soldPrice) {
        return null;
      }

      const techServiceFee = lodash.round(soldPrice * serviceFeeRate, 2); // 技术服务费
      const transferFee = lodash.round(soldPrice * 0.01, 2); // 转账服务费, rate: 1%
      const totalServiceFee = lodash.round(techServiceFee + transferFee + pkgAndIdFee, 2); // 服务费总和
      const salesRevenue = lodash.round(soldPrice - totalServiceFee, 2);
      const profit = lodash.round(salesRevenue - stockPrice - expressFee - otherFee, 2);
      const profitPercent = lodash.round((profit / stockPrice) * 100, 2);

      return {
        profit,
        profitPercent,
        techServiceFee,
        transferFee,
        totalServiceFee,
      };
    },
  },

  mounted() {
    this.$watch(
      (vm) => [vm.formData, vm.profitDetail],
      () => {
        this.$emit('change', this.formData, this.profitDetail);
      },
      {
        immediate: true,
        deep: true,
      },
    );
  },

  watch: {
    stock: {
      immediate: true,
      deep: true,
      handler(value) {
        Object.assign(this.formData, {
          ...DEFAULT_FORM_DATA,
        });
        const { sellSnapshots } = value;
        const sellSnapshot = sellSnapshots[0];
        if (sellSnapshot) {
          this.formData.soldPrice = sellSnapshot.price / 100;
        }
      },
    },
  },

  methods: {
    renderProductDetail() {
      const { product, productSize, stockPrice, stockDate } = this.stock;

      return (
        <a-row>
          <a-col span={4}>
            <img src={product.image} alt={product.name} height="56" />
          </a-col>
          <a-col span={20}>
            <a-descriptions size="small" column={2} colon={false}>
              <a-descriptions-item label="ARTICLE NUMBER">
                <span style={{ fontWeight: 'bold' }}>{product.articleNumber}</span>
              </a-descriptions-item>
              <a-descriptions-item label="STOCK DATE">
                <span style={{ fontWeight: 'bold' }}>{time.formatToDate(stockDate)}</span>
              </a-descriptions-item>
              <a-descriptions-item label="SIZE">
                <span style={{ fontWeight: 'bold' }}>{productSize.size}</span>
              </a-descriptions-item>
              <a-descriptions-item label="STOCK PRICE">
                <span style={{ fontWeight: 'bold' }}>{stockPrice}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-row>
      );
    },

    renderForm() {
      return (
        <a-row>
          <a-col span={12}>
            <a-form-model-item label="SOLD PRICE" required>
              <a-input-number
                v-model={this.formData.soldPrice}
                min={0}
                step={10}
                style={{ width: '100%' }}
              />
            </a-form-model-item>
          </a-col>

          <a-col span={12}>
            <a-form-model-item label="SOLD DATE" required>
              <a-date-picker v-model={this.formData.soldDate} style={{ width: '100%' }} />
            </a-form-model-item>
          </a-col>

          <a-col span={12}>
            <a-form-model-item label="SFE" required>
              <a-input-number
                v-model={this.formData.serviceFeeRate}
                style={{ width: '100%' }}
                min={0}
                max={100}
                step={0.025}
                formatter={(value) => (value ? `${value}%` : 0)}
                parser={(value) => (value ? value.replace('%', '') : 0)}
              />
            </a-form-model-item>
          </a-col>

          <a-col span={12}>
            <a-form-model-item label="PKG/ID FEE" required>
              <a-input-number
                v-model={this.formData.pkgAndIdFee}
                min={0}
                style={{ width: '100%' }}
                onChange={(value) => {
                  if (!value & (value !== 0)) {
                    this.formData.pkgAndIdFee = 0;
                  }
                }}
              />
            </a-form-model-item>
          </a-col>

          <a-col span={12}>
            <a-form-model-item label="EXPRESS FEE">
              <a-input-number
                v-model={this.formData.expressFee}
                min={0}
                style={{ width: '100%' }}
                onChange={(value) => {
                  if (!value & (value !== 0)) {
                    this.formData.expressFee = 0;
                  }
                }}
              />
            </a-form-model-item>
          </a-col>

          <a-col span={12}>
            <a-form-model-item label="OTHER FEE">
              <a-input-number
                v-model={this.formData.otherFee}
                min={0}
                style={{ width: '100%' }}
                onChange={(value) => {
                  if (!value & (value !== 0)) {
                    this.formData.otherFee = 0;
                  }
                }}
              />
            </a-form-model-item>
          </a-col>

          <a-col span={24}>
            <a-form-item label="DESCRIPTION" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <a-textarea
                v-model={this.formData.description}
                autoSize={{ minRows: 1, maxRows: 2 }}
              />
            </a-form-item>
          </a-col>
        </a-row>
      );
    },

    renderSummary() {
      const { profit, techServiceFee, transferFee } = this.profitDetail || {};
      const { soldPrice, pkgAndIdFee, expressFee, otherFee } = this.formData;
      const { stockPrice } = this.stock;

      return (
        <div>
          <a-statistic title="PROFIT" prefix="¥" value={profit} valueStyle={{ color: '#f5222d' }} />
          <div style={{ color: '#ccc', fontSize: '90%' }}>
            {`= ${soldPrice}(Sold) - ${techServiceFee}(Tech) - ${transferFee}(Transfer) - ${pkgAndIdFee}(Package/Identify) - ${expressFee}(Express) - ${otherFee}(Other) - ${stockPrice}(Stock)`}
          </div>
        </div>
      );
    },
  },

  render() {
    return (
      <div class={name}>
        <a-form-model labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} colon={false}>
          {this.renderProductDetail()}

          <a-divider />

          {this.renderForm()}

          <a-divider />

          {this.renderSummary()}
        </a-form-model>
      </div>
    );
  },
};
</script>
