import { lodash } from '@/utils';

const labelFormatter = (params, { historyMaxPriceItem, historyMinPriceItem, chartData }) => {
  const { seriesIndex, data, dataIndex } = params;
  const MAX_PRICE_SERIES_INDEX = 0;
  const MIN_PRICE_SERIES_INDEX = 1;
  const xValue = data[0];
  const yValue = data[1];

  if (
    seriesIndex === MAX_PRICE_SERIES_INDEX &&
    xValue === historyMaxPriceItem.purchaseDate &&
    yValue === historyMaxPriceItem.price
  ) {
    return `Highest\n${yValue}`;
  }

  if (
    seriesIndex === MIN_PRICE_SERIES_INDEX &&
    xValue === historyMinPriceItem.purchaseDate &&
    yValue === historyMinPriceItem.price
  ) {
    return `Lowest\n${yValue}`;
  }

  if (dataIndex >= chartData.rows.length - 7) {
    return yValue;
  }

  return '';
};

const normalize = (data) => {
  const list = lodash.orderBy(
    data.map(({ price, ...res }) => ({
      price: price / 100,
      ...res,
    })),
    ['purchaseDate', 'price'],
  );

  const listMap = lodash.groupBy(list, 'purchaseDate');

  return lodash.flatMap(Object.values(listMap), (val) => {
    const minItem = lodash.first(val);
    const maxItem = lodash.last(val);
    return {
      min: minItem.price,
      max: maxItem.price,
      purchaseDate: minItem.purchaseDate,
      orderSubTypeName: minItem.orderSubTypeName,
    };
  });
};

export {
  //
  labelFormatter,
  normalize,
};
