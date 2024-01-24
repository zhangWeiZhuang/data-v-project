import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import HomeView from '../views/datav/index.vue';
// 配置路由规则
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/budget',
        component: () => import('../views/budget/index.vue'),
    },
];
const router = new VueRouter({ routes, mode: 'history' });
export default router;
