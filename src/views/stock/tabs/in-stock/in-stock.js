import { time, lodash } from '@/utils';

const getProfitInfo = (stock) => {
  const { stockPrice, snapshotPrice, serviceFeeRate } = stock;
  if (!stockPrice) {
    return {};
  }
  const techServiceFee = lodash.round(snapshotPrice * serviceFeeRate, 2);
  const transferFee = lodash.round(snapshotPrice * 0.01, 2);
  const serviceFee = lodash.round(techServiceFee + transferFee + 33, 2); // 打包费+鉴别费=33
  const salesRevenue = lodash.round(snapshotPrice - serviceFee, 2);
  const profit = lodash.round(salesRevenue - stockPrice, 2);
  const profitPercent = lodash.round((profit / stockPrice) * 100, 2);
  return {
    techServiceFee, // 技术服务费
    transferFee, // 转账手续费
    salesRevenue, // 毛利
    profit, // 利润
    profitPercent, // 利润百分比
  };
};

const normalize = (data) => {
  const { stockPrice, sellSnapshots, ...res } = data;
  const sellSnapshot = sellSnapshots && sellSnapshots.length > 0 ? sellSnapshots[0] : null;
  const snapshotInfo = {};
  if (sellSnapshot) {
    const { createdAt, price, tradeDesc } = sellSnapshot;
    Object.assign(snapshotInfo, {
      snapshotDate: createdAt,
      snapshotPrice: price / 100, // 售出价格
      tradeDesc,
    });
  }
  const stock = {
    ...res,
    editing: false,
    serviceFeeRate: 0.05,
    stockPrice,
    sellSnapshots,
    ...snapshotInfo,
  };
  const profitInfo = getProfitInfo(stock);
  Object.assign(stock, profitInfo);
  return stock;
};

const getColumns = (vue) => {
  // eslint-disable-next-line no-unused-vars
  const h = vue.$createElement;
  const imageColumn = {
    dataIndex: 'product.image',
    title: 'Product',
    width: 100,
    customRender: (value, record) => {
      return (
        <img
          v-lazy={value}
          alt={record.product.name}
          style={{ height: '53.75px', width: '84px' }}
        />
      );
    },
  };

  const columns = [
    {
      dataIndex: 'product.name',
      title: 'Name',
    },
    {
      dataIndex: 'productSize.size',
      title: 'Size',
      width: 60,
    },
    {
      dataIndex: 'product.articleNumber',
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
      dataIndex: 'stockPrice',
      title: 'Stock Price',
      width: 120,
      customRender: (value, record, index) => {
        return record.editing ? (
          <a-input-number
            ref={`stockPrice-${index}`}
            value={record.stockPrice}
            style={{ width: '6rem' }}
            onBlur={(e) => {
              const stockPrice = parseInt(e.target.value || 0, 10);
              vue.updateStock(record, stockPrice, index);
            }}
            onPressEnter={() => {
              vue.$refs[`stockPrice-${index}`].blur();
            }}
          />
        ) : (
          <span
            class="hover-edit"
            onClick={() => {
              record.editing = true;
              vue.$nextTick(() => {
                vue.$refs[`stockPrice-${index}`].focus();
              });
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: 'Price Info',
      width: 240,
      customRender: (value, record) => {
        if (!record.stockPrice || !record.sellSnapshots || record.sellSnapshots.length === 0) {
          return '-';
        }

        const {
          snapshotPrice,
          techServiceFee,
          transferFee,
          salesRevenue,
          profit,
          profitPercent,
          tradeDesc,
          snapshotDate,
        } = record;

        const valueDisplay = (
          <div>
            <div>
              <a-tag v-tooltip={time.formatToTime(snapshotDate)}>
                {tradeDesc} | {snapshotPrice}
              </a-tag>
              <a-tag
                v-tooltip={`${snapshotPrice} - ${techServiceFee} - ${transferFee} - 33 = ${salesRevenue}`}
              >
                到手: {salesRevenue}
              </a-tag>
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <a-tag color={vue.getProfitTagColor(profit)}>
                <span>利润: {profit}</span>
              </a-tag>
              <a-tag color={vue.getProfitPercentTagColor(profitPercent)}>{profitPercent}%</a-tag>
            </div>
          </div>
        );
        return valueDisplay;
      },
    },
    {
      title: 'SFR',
      customRender: (value, record) => {
        return (
          <a-input-number
            value={record.serviceFeeRate}
            style={{ width: '4.375rem' }}
            onBlur={(e) => {
              const serviceFeeRate = parseFloat(e.target.value || 0.05);
              Object.assign(record, {
                ...getProfitInfo({ ...record, serviceFeeRate }),
                serviceFeeRate,
              });
            }}
          />
        );
      },
    },
    {
      title: 'Actions',
      width: 140,
      customRender: (value, record, index) => {
        return (
          <div>
            <a-button
              size="small"
              icon="stock"
              v-tooltip="View Trends"
              onClick={() => vue.onViewTrends(record, index)}
            />

            <a-button
              type="primary"
              size="small"
              icon="transaction"
              v-tooltip="Set Sale"
              onClick={() => vue.onSale(record, index)}
            />

            <a-popconfirm
              title="Confirm to delete?"
              onConfirm={() => vue.onDeleteClick(record.id, index)}
            >
              <a-button type="danger" size="small" icon="delete" />
            </a-popconfirm>
          </div>
        );
      },
    },
  ];

  if (vue.showImage) {
    columns.unshift(imageColumn);
  }

  return columns;
};

const SORT_TYPES = {
  USE_PROFIT: 'USE_PROFIT',
  USE_PROFIT_PERCENT: 'USE_PROFIT_PERCENT',
};

export {
  //
  getProfitInfo,
  normalize,
  getColumns,
  SORT_TYPES,
};
