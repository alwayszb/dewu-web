<script>
import { time } from '@/utils';
import { favoriteApi } from '@/api';

const name = 'task';

const rowKey = 'id';

export default {
  name,
  data() {
    this.name = name;
    this.columns = [
      {
        dataIndex: 'product.image',
        title: 'Product',
        width: 100,
        customRender: (value, record) => {
          return <img src={value} alt={record.product.title} width={80} />;
        },
      },
      {
        dataIndex: 'product.name',
        title: 'Name',
      },
      {
        dataIndex: 'product.articleNumber',
        title: 'Article Number',
        width: 130,
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
        customRender: () => {
          return <a-button type="danger" size="small" icon="delete" />;
        },
      },
    ];

    return {
      dataSource: [],
    };
  },
  created() {
    favoriteApi.findAllFavorites().then(({ data }) => {
      this.dataSource = data;
    });
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
