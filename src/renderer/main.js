import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/emoji.css'

import {
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  Input,
  MessageBox,
  Notification,
  Container,
  Aside,
  Header,
  Main,
  Loading,
  Table,
  TableColumn
} from 'element-ui'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Checkbox)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Loading)
Vue.use(Table)
Vue.use(TableColumn)

Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
