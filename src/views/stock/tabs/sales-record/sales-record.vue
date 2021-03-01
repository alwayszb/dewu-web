<script>
import { salesRecordApi } from '@/api';
import { lodash } from '@/utils';
import { getColumns } from './sales-record';

const name = 'sales-record';

const rowKey = 'id';

export default {
  name,

  props: {
    showImage: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      columns: getColumns(this),
      salesRecordList: [],
      searchValue: '',
    };
  },

  computed: {
    totalProfit() {
      return lodash.round(lodash.sumBy(this.salesRecordList, 'profit'), 2);
    },
    averageProfit() {
      return lodash.round(this.totalProfit / this.salesRecordList.length, 2);
    },
  },

  created() {
    this.loadAllSalesRecords();
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
    loadAllSalesRecords() {
      salesRecordApi.findAllSalesRecords().then(({ data }) => {
        this.salesRecordList = data;
      });
    },
    renderSummary() {
      if (this.salesRecordList.length === 0) {
        return;
      }

      const tagStyles = { padding: '0.25rem 0.5rem' };
      const numberStyles = { fontWeight: 'bold' };

      return (
        <a-tag color="red" style={tagStyles}>
          <span>PROFIT: </span>
          <span style={numberStyles}>
            {this.totalProfit} ┃ {this.averageProfit}(AVG)
          </span>
        </a-tag>
      );
    },
  },

  render() {
    return (
      <div class={name}>
        <div
          class={`${name}-header`}
          style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem 0.75rem' }}
        >
          <div style={{ flex: 1 }}>
            <a-input-search
              v-model={this.searchValue}
              placeholder="Article Number / Product Name"
              style={{ width: '16rem' }}
            />
            <a-button
              icon="sync"
              style={{ margin: '0 0.5rem' }}
              onClick={() => this.loadAllSalesRecords(this.searchValue)}
            />
          </div>
          {this.renderSummary()}
        </div>
        <a-table
          dataSource={this.salesRecordList}
          columns={this.columns}
          rowKey={rowKey}
          pagination={false}
        />
      </div>
    );
  },
};
</script>
