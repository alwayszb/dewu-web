const getOuterHeight = (el) => {
  const style = window.getComputedStyle(el);
  const props = ['height', 'margin-top', 'margin-bottom'];
  return props
    .map((key) => parseInt(style.getPropertyValue(key), 10))
    .reduce((prev, cur) => prev + cur);
};

const getPagedData = (data, page, pageSize) => {
  const start = (page - 1) * pageSize;
  const total = data.length;
  const preEnd = start + pageSize;
  const end = preEnd > total ? total : preEnd;
  return data.slice(start, end);
};

const debounce = (fn, delay) => {
  let timer;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, fn, delay);
    }, delay || 200);
  };
};

export default {
  getOuterHeight,
  getPagedData,
  debounce,
};
