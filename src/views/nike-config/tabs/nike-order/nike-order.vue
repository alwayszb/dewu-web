<script>
import { nikeOrderApi } from '@/api';
import { time } from '@/utils';

const name = 'app-account';
const api = {
  ...nikeOrderApi,
};

export default {
  name,
  data() {
    this.columns = [
      {
        dataIndex: 'image',
        title: 'Product',
        width: 100,
        customRender: (value, record) => {
          return (
            <img v-lazy={value} alt={record.title} style={{ height: '68px', width: '68px' }} />
          );
        },
      },
      { dataIndex: 'orderId', title: 'Order ID', width: 130 },
      { dataIndex: 'title', title: 'Title' },
      { dataIndex: 'styleColor', title: 'Article Number', width: 130 },
      { dataIndex: 'size', title: 'Size', width: 100 },
      {
        dataIndex: 'orderDate',
        title: 'Order Date',
        width: 180,
        customRender: (value) => time.formatToTime(value),
      },
      {
        dataIndex: 'lineItemStatus',
        title: 'Status',
        width: 100,
        customRender: (value) => (value === '送达时间' ? '已送达' : value),
      },
      { dataIndex: 'appAccount.userName', title: 'Account', width: 120 },
    ];

    return {};
  },
  methods: {},
  render() {
    return (
      <div class={name}>
        <data-table ref="table" api={api} columns={this.columns} scrollX={false} />
      </div>
    );
  },
};
</script>
