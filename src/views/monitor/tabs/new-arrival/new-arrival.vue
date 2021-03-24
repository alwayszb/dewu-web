<script>
const name = 'new-arrival';

export default {
  name,
  data() {
    this.columns = [
      { dataIndex: 'image', title: 'Image' },
      { dataIndex: 'name', title: 'Product' },
      { dataIndex: 'size', title: 'Size' },
      { dataIndex: 'lockPrice', title: 'Lock Price' },
      { dataIndex: 'lockCount', title: 'Lock Count' },
    ];

    return {
      dataSource: [],
    };
  },
  mounted() {},
  render() {
    return (
      <du-table
        dataSource={this.dataSource}
        columns={this.columns}
        rowKey="image"
        full-height
      ></du-table>
    );
  },
};
</script>
