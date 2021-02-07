<script>
import lodash from 'lodash';
import { purchaseRecordApi } from '@/api';
import { labelFormatter, normalize } from './trends';

const name = 'trends';

export default {
  name,
  props: {
    spuId: {
      type: Number,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
  },
  data() {
    this.name = name;
    this.extend = {
      series: {
        label: {
          show: true,
          formatter: (params) => labelFormatter(params, this),
        },
      },
    };
    return {
      loading: false,
      dataEmpty: true,
      chartData: {
        columns: ['purchaseDate', 'min'],
        rows: [],
      },
      chartSettings: {
        labelMap: {
          min: '最低成交价格',
          max: '最高成交价格',
        },
        min: [],
        max: [],
      },
      latestPriceItem: null,
      historyMaxPriceItem: null,
      historyMinPriceItem: null,
    };
  },
  watch: {
    spuId: {
      immediate: true,
      handler() {
        this.loadPurchaseHistory();
      },
    },
    size() {
      this.loadPurchaseHistory();
    },
  },
  methods: {
    loadPurchaseHistory() {
      if (!this.size || !this.spuId) {
        return;
      }
      this.loading = true;
      this.dataEmpty = true;
      this.chartData.rows = [];
      purchaseRecordApi
        .findPurchaseRecordsByProduct({ spuId: this.spuId, size: this.size })
        .then(({ data }) => {
          if (data.length === 0) {
            this.$Message({
              type: 'warn',
              text: 'No trends data',
            });
            return;
          }

          this.chartData.rows = normalize(data);
          this.dataEmpty = false;

          const sortedItems = data.sort((a, b) => a.price - b.price);
          const maxItem = lodash.last(sortedItems);
          const minItem = lodash.first(sortedItems);
          const maxPrice = maxItem.price / 100;
          const minPrice = minItem.price / 100;

          this.latestPriceItem = lodash.last(this.chartData.rows);
          this.historyMaxPriceItem = { ...maxItem, price: maxPrice };
          this.historyMinPriceItem = { ...minItem, price: minPrice };

          this.chartSettings.max = [
            maxPrice - (maxPrice % 100) + (maxPrice % 100 === 99 ? 200 : 100),
          ];
          this.chartSettings.min = [minPrice - (minPrice % 100) - (minPrice % 100 === 9 ? 100 : 0)];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  render() {
    return (
      <div class={name}>
        {!this.loading && this.chartData.rows.length !== 0 && (
          <div class="text-center" style={{ marginBottom: '1rem' }}>
            {this.historyMaxPriceItem && (
              <span class="h-tag h-tag-bg-primary">
                <span>历史最高: </span>
                <span style={{ fontWeight: 600, fontSize: '1rem', textDecoration: 'underline' }}>
                  {this.historyMaxPriceItem.price}
                </span>
                <span style={{ marginLeft: '0.125rem' }}>
                  (
                  {`${this.historyMaxPriceItem.purchaseDate} ${this.historyMaxPriceItem.orderSubTypeName}`}
                  )
                </span>
              </span>
            )}
            {this.historyMinPriceItem && (
              <span class="h-tag h-tag-bg-blue">
                <span>历史最低: </span>
                <span style={{ fontWeight: 600, fontSize: '1rem', textDecoration: 'underline' }}>
                  {this.historyMinPriceItem.price}
                </span>
                <span> ({this.historyMinPriceItem.purchaseDate})</span>
              </span>
            )}
            {this.latestPriceItem && (
              <span class="h-tag">
                <span>最新低价: </span>
                <span style={{ fontWeight: 600, fontSize: '1rem', textDecoration: 'underline' }}>
                  {this.latestPriceItem.min}
                </span>
                <span style={{ marginLeft: '0.125rem' }}>
                  ({`${this.latestPriceItem.purchaseDate} ${this.latestPriceItem.orderSubTypeName}`}
                  )
                </span>
              </span>
            )}
          </div>
        )}
        <ve-line
          data={this.chartData}
          settings={this.chartSettings}
          extend={this.extend}
          loading={this.loading}
          dataEmpty={this.dataEmpty}
          height="500px"
        />
      </div>
    );
  },
};
</script>
