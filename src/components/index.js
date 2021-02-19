const install = (Vue) => {
  const componentsContext = require.context('.', true, /\.vue$/);
  componentsContext.keys().forEach((component) => {
    const componentConfig = componentsContext(component);
    const ctrl = componentConfig.default || componentConfig;
    const { name } = ctrl;
    if (!name) {
      return;
    }
    Vue.component(name, ctrl);
  });
};

export default {
  install,
};
