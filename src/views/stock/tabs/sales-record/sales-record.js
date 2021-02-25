const getColumns = (vue) => {
  // eslint-disable-next-line no-unused-vars
  const { $createElement: h } = vue;

  return [
    {
      dataIndex: 'stock.product.image',
      title: 'Product',
      width: 100,
      customRender: (value, record) => {
        return (
          <img
            v-lazy={value}
            alt={record.stock.product.title}
            style={{ height: '53.75px', width: '84px' }}
          />
        );
      },
    },
    {
      dataIndex: 'stock.product.name',
      title: 'Name',
    },
    {
      dataIndex: 'stock.productSize.size',
      title: 'Size',
      width: 60,
    },
    {
      dataIndex: 'stock.product.articleNumber',
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
                if (vue.$clipboard(value)) {
                  vue.$message.success('copy success');
                } else {
                  vue.$message.error('copy failed');
                }
              }}
            />
          </div>
        );
      },
    },
    {
      dataIndex: 'stock.stockPrice',
      title: 'Stock Price',
      width: 120,
    },
    {
      dataIndex: 'soldPrice',
      title: 'Sold Price',
      width: 120,
    },
    {
      dataIndex: 'serviceFee',
      title: 'Service Fee',
      width: 120,
    },
    {
      dataIndex: 'expressFee',
      title: 'Express Fee',
      width: 120,
    },
    {
      dataIndex: 'otherFee',
      title: 'Other Fee',
      width: 120,
    },
    {
      dataIndex: 'profit',
      title: 'Profit',
      width: 120,
    },
  ];
};

export {
  //
  getColumns,
};
