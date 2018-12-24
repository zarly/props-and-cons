import Vue from 'vue'
import Router from 'vue-router'
import Ideas from '../pages/ideas.vue'
import Idea from '../pages/idea.vue'
import {sendParams} from '../modules/stats'

Vue.use(Router);

const router = new Router({
	routes: [
		{
			path: '/',
			name: 'root',
			component: Ideas
		},
		{
			path: '/ideas',
			name: 'ideas',
			component: Ideas
		},
		{
			path: '/idea/:id',
			name: 'idea',
			component: Idea,
			props: true
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
});

router.afterEach((to, from) => {
	sendParams('navigate', to && to.name, from && from.name);
});

export default router;
