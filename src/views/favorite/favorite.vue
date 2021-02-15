<script>
import { time } from '@/utils';
import { productApi } from '@/api';

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
          return <img src={value} alt={record.title} width={80} />;
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
            <a-button
              type="danger"
              size="small"
              icon="delete"
              onClick={() => this.onDelete(record, index)}
            />
          );
        },
      },
    ];

    return {
      dataSource: [],
    };
  },
  created() {
    productApi.findFavoriteProducts().then(({ data }) => {
      this.dataSource = data;
    });
  },
  methods: {
    onDelete({ id }, index) {
      productApi.removeProductFavorite(id).then(() => {
        this.$message.success('Delete success');
        this.dataSource.splice(index, 1);
      });
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
        ></a-table>
      </div>
    );
  },
};
</script>
