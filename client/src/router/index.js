import Vue from 'vue'
import Router from 'vue-router'
import Ideas from '../pages/ideas.vue'
import Idea from '../pages/idea.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ideas',
      component: Ideas
    },
    {
      path: '/idea',
      name: 'idea',
      component: Idea
    },
    {
      path: '/idea-add',
      name: 'idea-add',
      component: () => import(/* webpackChunkName: "idea-add" */ '../pages/idea_add.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ '../pages/settings.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import(/* webpackChunkName: "demo" */ '../pages/demo.vue')
    },
  ]
})
