import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Layout from '@/components/layout/Layout'
import MyGoods from '@/components/pages/GoodsManagement/MyGoods'
import MyMerchants from '@/components/pages/MerchantsManagement/MyMerchants'
import GoodsTable from '@/components/pages/TableManagement/GoodsTable'
import MerchantsTable from '@/components/pages/TableManagement/MerchantsTable'
import RoleManagement from '@/components/pages/SystemManagement/RoleManagement'
import RoleControl from '@/components/pages/SystemManagement/RoleControl'
import NodeManagement from '@/components/pages/SystemManagement/NodeManagement'
import UserManagement from '@/components/pages/SystemManagement/UserManagement'

import {beforeEnter} from '../components/js/beforeEnter.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Layout',
      name: 'Layout',
      component: Layout,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/MyGoods',
      name: 'MyGoods',
      component: MyGoods,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/MyMerchants',
      name: 'MyMerchants',
      component: MyMerchants,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/GoodsTable',
      name: 'GoodsTable',
      component: GoodsTable,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/MerchantsTable',
      name: 'MerchantsTable',
      component: MerchantsTable,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/UserManagement',
      name: 'UserManagement',
      component: UserManagement,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/RoleManagement',
      name: 'RoleManagement',
      component: RoleManagement,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/RoleControl',
      name: 'RoleControl',
      component: RoleControl,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    },
    {
      path: '/NodeManagement',
      name: 'NodeManagement',
      component: NodeManagement,
      beforeEnter: (to, from, next) => {
        beforeEnter(to, from, next)
      }
    }
  ]
})
