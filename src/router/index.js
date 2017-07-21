import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Currency from '@/components/Currency'
import Product from '@/components/Product'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/currency',
      name: 'Currency',
      component: Currency
    },
    {
      path: '/product',
      name: 'Product',
      component: Product
    }
  ]
})
