import Vue from 'vue'
import App from './App.vue'
// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/media.less'

Vue.use(dataV)
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
