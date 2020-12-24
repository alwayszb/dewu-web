import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/home';
import Search from '@/views/product/search';
import Collect from '@/views/collect';
import Task from '@/views/task';
import Notice from '@/views/notice';
import Calendar from '@/views/calendar';
import { NotFound } from '@/views/error';

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
