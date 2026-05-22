import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import ChargeSettle from '@/views/ChargeSettle.vue'
import RefundManage from '@/views/RefundManage.vue'
import Statistics from '@/views/Statistics.vue'
import ChargeItemManage from '@/views/ChargeItemManage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/charge-settle',
    children: [
      {
        path: 'charge-settle',
        name: 'ChargeSettle',
        component: ChargeSettle
      },
      {
        path: 'refund-manage',
        name: 'RefundManage',
        component: RefundManage
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: Statistics
      },
      {
        path: 'charge-item-manage',
        name: 'ChargeItemManage',
        component: ChargeItemManage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else {
    token ? next() : next('/login')
  }
})

export default router