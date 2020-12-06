// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import globalVariable from '@/api/global_variable.js'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()

Vue.prototype.global = globalVariable
Vue.use(VueResource)
Vue.use(iView)
// Vue.use(ElementUI)

Vue.use(ElementUI, { size: 'mini', zIndex: 3000 })

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
