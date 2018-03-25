import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const Home = resolve => require(['@/components/Home.vue'], resolve)
const Login = resolve => require(['@/components/Login.vue'], resolve)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.Wechaty.user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
    // next()
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
