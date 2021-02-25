<script>
import { salesRecordApi } from '@/api';
import { getColumns } from './sales-record';

const name = 'sales-record';

const rowKey = 'id';

export default {
  name,
  data() {
    return {
      columns: getColumns(this),
      salesRecordList: [],
      searchValue: '',
    };
  },
  created() {
    this.loadAllSalesRecords();
  },
  methods: {
    loadAllSalesRecords() {
      salesRecordApi.findAllSalesRecords().then(({ data }) => {
        this.salesRecordList = data;
      });
    },
  },
  render() {
    return (
      <div class={name}>
        <div class={`${name}-header`} style={{ padding: '0 0.75rem 0.75rem' }}>
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
        <a-table dataSource={this.salesRecordList} columns={this.columns} rowKey={rowKey}></a-table>
      </div>
    );
  },
};
</script>
