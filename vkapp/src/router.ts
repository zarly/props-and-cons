import Vue from 'vue'
import Router from 'vue-router'
import Ideas from './views/ideas.vue'
import Idea from './views/idea.vue'

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
      component: () => import(/* webpackChunkName: "idea-add" */ './views/idea_add.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ './views/settings.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import(/* webpackChunkName: "demo" */ './views/demo.vue')
    },
  ]
})
