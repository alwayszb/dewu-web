import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/home';
import Search from '@/views/product/search';
import Favorite from '@/views/favorite';
import Task from '@/views/task';
import Notice from '@/views/notice';
import Calendar from '@/views/calendar';
import { NotFound } from '@/views/error';
import Stock from '@/views/stock';

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
    path: '/favorite',
    name: 'favorite',
    component: Favorite,
  },
  {
    path: '/task',
    name: 'task',
    component: Task,
  },
  {
    path: '/notice',
    name: 'notice',
    component: Notice,
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: NotFound,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: Calendar,
  },
  {
    path: '/stock',
    name: 'stock',
    component: Stock,
  },
  {
    path: '*',
    redirect: {
      name: 'not-found',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
