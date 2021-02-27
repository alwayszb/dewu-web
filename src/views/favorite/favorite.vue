<script>
import { time } from '@/utils';
import { productApi } from '@/api';
import { lodash } from '@/utils';

const name = 'task';

const rowKey = 'id';

export default {
  name,
  data() {
    this.name = name;
    this.columns = [
      {
        dataIndex: 'image',
        title: 'Product',
        width: 100,
        customRender: (value, record) => {
          return (
            <img v-lazy={value} alt={record.title} style={{ height: '53.75px', width: '84px' }} />
          );
        },
      },
      {
        dataIndex: 'name',
        title: 'Name',
      },
      {
        dataIndex: 'articleNumber',
        title: 'Article Number',
        width: 140,
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
        dataIndex: 'createdAt',
        title: 'Favorite Date',
        width: 200,
        customRender: (value) => (value ? time.formatToTime(value) : '-'),
      },
      {
        title: 'Actions',
        width: 200,
        customRender: (value, record, index) => {
          return (
            <div>
              <a-button
                size="small"
                icon="stock"
                onClick={() => this.onViewTrends(record, index)}
              />
              <a-button
                type="danger"
                size="small"
                icon="delete"
                onClick={() => this.onDelete(record, index)}
              />
            </div>
          );
        },
      },
    ];

    return {
      dataSource: [],
      actionRecord: {},
      trendsModalVisible: false,
    };
  },
  activated() {
    productApi.findFavoriteProducts().then(({ data }) => {
      this.dataSource = data;
    });
  },
  methods: {
    onDelete(record, index) {
      this.actionRecord = record;
      const { id } = record;
      productApi.removeProductFavorite(id).then(() => {
        this.$message.success('Delete success');
        this.dataSource.splice(index, 1);
      });
    },
    onViewTrends(record) {
      this.actionRecord = record;
      this.trendsModalVisible = true;
    },
  },
  render() {
    return (
      <div class={name}>
        <a-table
          dataSource={this.dataSource}
          columns={this.columns}
          rowKey={rowKey}
          pagination={false}
        />
        {/** trends modal */}
        {!lodash.isEmpty(this.actionRecord) && (
          <trends-modal
            v-model={this.trendsModalVisible}
            articleNumber={this.actionRecord.articleNumber}
            productName={this.actionRecord.name}
          />
        )}
      </div>
    );
  },
};
</script>
