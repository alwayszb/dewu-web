import Vue from 'vue';
import VueRouter from 'vue-router';
import Charts from '../views/Charts.vue';
import Home from '../views/home';
import Search from '../views/product/search';
import Collect from '../views/collect';
import Task from '../views/task';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
  {
    path: '/collect',
    name: 'collect',
    component: Collect,
  },
  {
    path: '/task',
    name: 'task',
    component: Task,
  },
  {
    path: '/charts',
    name: 'charts',
    component: Charts,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
