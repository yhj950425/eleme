import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource';

// import Hello from '@/components/Hello'
import goods from '../components/goods/goods';
import ratings from '../components/ratings/ratings';
import seller from '../components/seller/seller';
import header from '../components/header/header';

Vue.use(Router);
Vue.use(Resource);
export default new Router({
  linkActiveClass:'active',
  routes: [{
    path: '/',
    redirect: '/goods'
    }, {
      path: '/goods',
      component: goods
    }, {
      path: '/header',
      component: header
    },{
      path: '/ratings',
      component: ratings
    }, {
      path: '/seller',
      component: seller
    }]
})
